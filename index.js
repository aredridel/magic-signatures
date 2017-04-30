const ltx = require('ltx');
const forge = require('node-forge');
const crypto = require('crypto');
const promisify = require("es6-promisify");
const rsakeygen = promisify(require('rsa-json'));
const MAGICNS = 'http://salmon-protocol.org/ns/magic-env';

module.exports = {
    toXML,
    fromXML,
    verify,
    generate,
    sign,
    btob64u,
    b64utob,
    magicToRSA,
    RSAToMagic
}

function verify(doc, key) {
    if (doc.encoding !=  'base64url') throw new Error(`Unsupported encoding '${doc.encoding}'`);
    if (!key) throw new Error(`Key must be provided`);
    const data = b64utob(doc.data);
    const sigs = key.key_id ? doc.sigs.filter(e => e.key_id == key.key_id) : doc.sigs;

    if (!sigs.length) throw new Error(`No signature found with key_id '${key.key_id}'`);
    if (doc.alg != 'RSA-SHA256') throw new Error(`Unsupported algorithm '${doc.alg}'`);

    const rsa = getPublicKey(key);
    const signable = sigstr(doc);

    const verified = sigs.filter(sig => {
	const ver = crypto.createVerify('RSA-SHA256');
	ver.update(signable);
	return ver.verify(rsa, b64utob(sig.value));
    });

    if (verified.length) {
	return { data, data_type: doc.data_type };
    } else {
	throw new Error("Bad signature");
    }
}

function magicToRSA(key) {
    const parts = key.split('.');
    if (parts[0] != 'RSA') throw new Error(`Unsupported algorithm '${parts[0]})'`);
    const keyParts = parts.slice(1);

    const modulus = b64utob(parts[1]).toString('hex');
    const exponent = b64utob(parts[2]).toString('hex');

    if (keyParts.length > 2) {
	const d = b64utob(parts[3]).toString('hex');
	return forge.pki.setRsaPrivateKey.apply(null, keyParts.map(e => b64utob(e).toString('hex')));
    } else {
	return forge.pki.setRsaPublicKey.apply(null, keyParts.map(e => b64utob(e).toString('hex')));
    }
}

function RSAToMagic(key) {
    const rsa = /PRIVATE/.test(key) ? forge.pki.privateKeyFromPem(key) : forge.pki.publicKeyFromPem(key);
    const parts = [rsa.n, rsa.e, rsa.d, rsa.p, rsa.q, rsa.dP, rsa.dQ, rsa.qInv].filter(e => !!e);
    return ['RSA'].concat(parts.map(e => btob64u(new Buffer(pad(e.toString(16)), 'hex')))).join('.');
}

function sign(doc, key) {
    const data_type = doc.data_type;
    const alg = 'RSA-SHA256';
    const encoding = 'base64url';
    const data = btob64u(doc.data);

    const signedDoc = {
	data,
	data_type,
	alg,
	encoding
    };

    const signer = crypto.createSign(alg);
    signer.update(sigstr(signedDoc));
    const signature = signer.sign(key);

    signedDoc.sigs = [
	{
	    value: signature
	}
    ]

    return signedDoc;
}

function sigstr(doc) {
    return [b64utob(doc.data), doc.data_type, doc.encoding, doc.alg].map(btob64u).join('.');
}

function getPublicKey(keyin) {
    const key = keyin.value ? keyin.value : keyin;
    return /-----BEGIN RSA PRIVATE KEY-----/.test(key) ? forge.pki.publicKeyToPem(forge.pki.privateKeyFromPem(key))
	: /^RSA\./.test(key) ? forge.pki.publicKeyToPem(magicToRSA(key))
	: key;
}

function getPrivateKey(key) {
    if (/-----BEGIN RSA PRIVATE KEY-----/.test(key)) {
	return key;
    } else if (/^RSA\./.test(key)) {
	return forge.pki.privateKeyToPem(magicToRSA(key))
    } else {
	throw new Error("not a private key");
    }
}

function fromXML(doc) {
    const parsed = typeof doc == 'string' ? ltx.parse(doc) : doc;

    if (!parsed.is('env', MAGICNS)) throw new Error(`XML must be an env element in the ${MAGICNS} namespace`);

    const data = parsed.getChild('data', MAGICNS)
    const encoding = parsed.getChild('encoding', MAGICNS);
    const alg = parsed.getChild('alg', MAGICNS);
    const sigs = parsed.getChildren('sig', MAGICNS);

    return {
        data: data.getText(),
        data_type: data.attrs['type'],
        encoding: encoding.getText(),
        alg: alg.getText(),
        sigs: sigs.map(sig => ({
            key_id: sig.attrs['key_id'],
            value: sig.getText()
        }))
    };
}

function generate(bits) {
    return rsakeygen(bits).then(key => ({
	public_key: RSAToMagic(key.public),
	private_key: RSAToMagic(key.private),
    }));
}

function toXML(env) {
    const root = new ltx.Element('env', { xmlns: MAGICNS });
    root.c('data', { type: env.data_type }).t(env.data);
    root.c('alg').t(env.alg);
    env.sigs.forEach(sig => root.c('sig', { key_id: sig.key_id }).t(sig.value));
    root.c('encoding').t(env.encoding);
    return root.toString();
}

function b64utob(str) {
    return new Buffer(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function btob64u(buf) {
    if (!Buffer.isBuffer(buf)) {
	buf = new Buffer(buf);
    }
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

function pad(x) {
    return x.length % 2 == 0 ? x : "0" + x;
}
