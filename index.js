const ltx = require('ltx');
const MAGICNS = 'http://salmon-protocol.org/ns/magic-env';

module.exports = {
    toXML,
    fromXML,
    verify,
    encode
}

function verify(doc) {
}

function encode(doc) {
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

function toXML(env) {
    const root = new ltx.Element('env', { xmlns: MAGICNS });
    root.c('data', { type: env.data_type }).t(env.data);
    root.c('alg').t(env.alg);
    env.sigs.forEach(sig => root.c('sig', { key_id: sig.key_id }).t(sig.value));
    root.c('encoding').t(env.encoding);
    return root.toString();
}
