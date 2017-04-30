const tape = require('tape');
const magic = require('../');

const TEST_PUBLIC_KEY = 'RSA.mVgY8RN6URBTstndvmUUPb4UZTdwvwmddSKE5z_jvKUEK6yk1u3rrC9yN8k6FilGj9K0eeUPe2hf4Pj-5CmHww==' +
  '.AQAB';

const TEST_PRIVATE_KEY = 'RSA.mVgY8RN6URBTstndvmUUPb4UZTdwvwmddSKE5z_jvKUEK6yk1u3rrC9yN8k6FilGj9K0eeUPe2hf4Pj-5CmHww==' +
  '.AQAB' +
  '.Lgy_yL3hsLBngkFdDw1Jy9TmSRMiH6yihYetQ8jy-jZXdsZXd8V5ub3kuBHHk4M39i3TduIkcrjcsiWQb77D8Q==';

const XML = `<?xml version='1.0' encoding='UTF-8'?>
<me:env xmlns:me='http://salmon-protocol.org/ns/magic-env'>
  <me:data type='application/atom+xml'>
    PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz4KPGVudHJ5IHhtbG5zPS
    dodHRwOi8vd3d3LnczLm9yZy8yMDA1L0F0b20nPgogIDxpZD50YWc6ZXhhbXBsZS5jb20s
    MjAwOTpjbXQtMC40NDc3NTcxODwvaWQ-ICAKICA8YXV0aG9yPjxuYW1lPnRlc3RAZXhhbX
    BsZS5jb208L25hbWUPHVyaT5hY2N0OmpwYW56ZXJAZ29vZ2xlLmNvbTwvdXJpPjwvYXV0a
    G9yPgogIDx0aHI6aW4tcmVwbHktdG8geG1sbnM6dGhyPSdodHRwOi8vcHVybC5vcmcvc3l
    uZGljYXRpb24vdGhyZWFkLzEuMCcKICAgICAgcmVmPSd0YWc6YmxvZ2dlci5jb20sMTk5O
    TpibG9nLTg5MzU5MTM3NDMxMzMxMjczNy5wb3N0LTM4NjE2NjMyNTg1Mzg4NTc5NTQnPnR
    hZzpibG9nZ2VyLmNvbSwxOTk5OmJsb2ctODkzNTkxMzc0MzEzMzEyNzM3LnBvc3QtMzg2M
    TY2MzI1ODUzODg1Nzk1NAogIDwvdGhyOmluLXJlcGx5LXRvPgogIDxjb250ZW50PlNhbG1
    vbiBzd2ltIHVwc3RyZWFtITwvY29udGVudD4KICA8dGl0bGUU2FsbW9uIHN3aW0gdXBzdH
    JlYW0hPC90aXRsZT4KICA8dXBkYXRlZD4yMDA5LTEyLTE4VDIwOjA0OjAzWjwvdXBkYXRl
    ZD4KPC9lbnRyeT4KICAgIA
  </me:data>
  <me:encoding>base64url</me:encoding>
  <me:alg>RSA-SHA256</me:alg>
  <me:sig key_id="4k8ikoyC2Xh+8BiIeQ+ob7Hcd2J7/Vj3uM61dy9iRMI=">
    EvGSD2vi8qYcveHnb-rrlok07qnCXjn8YSeCDDXlbhILSabgvNsPpbe76up8w63i2f
    WHvLKJzeGLKfyHg8ZomQ
  </me:sig>
</me:env>`;

const MAGICJSON = {
  "data": `PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz4KPGVudHJ5IHhtbG5zPS
      dodHRwOi8vd3d3LnczLm9yZy8yMDA1L0F0b20nPgogIDxpZD50YWc6ZXhhbXBsZS5jb20s
      MjAwOTpjbXQtMC40NDc3NTcxODwvaWQ-ICAKICA8YXV0aG9yPjxuYW1lPnRlc3RAZXhhbX
      BsZS5jb208L25hbWUPHVyaT5hY2N0OmpwYW56ZXJAZ29vZ2xlLmNvbTwvdXJpPjwvYXV0a
      G9yPgogIDx0aHI6aW4tcmVwbHktdG8geG1sbnM6dGhyPSdodHRwOi8vcHVybC5vcmcvc3l
      uZGljYXRpb24vdGhyZWFkLzEuMCcKICAgICAgcmVmPSd0YWc6YmxvZ2dlci5jb20sMTk5O
      TpibG9nLTg5MzU5MTM3NDMxMzMxMjczNy5wb3N0LTM4NjE2NjMyNTg1Mzg4NTc5NTQnPnR
      hZzpibG9nZ2VyLmNvbSwxOTk5OmJsb2ctODkzNTkxMzc0MzEzMzEyNzM3LnBvc3QtMzg2M
      TY2MzI1ODUzODg1Nzk1NAogIDwvdGhyOmluLXJlcGx5LXRvPgogIDxjb250ZW50PlNhbG1
      vbiBzd2ltIHVwc3RyZWFtITwvY29udGVudD4KICA8dGl0bGUU2FsbW9uIHN3aW0gdXBzdH
      JlYW0hPC90aXRsZT4KICA8dXBkYXRlZD4yMDA5LTEyLTE4VDIwOjA0OjAzWjwvdXBkYXRl
      ZD4KPC9lbnRyeT4KICAgIA`,
  "data_type": "application/atom+xml",
  "encoding": "base64url",
  "alg": "RSA-SHA256",
  "sigs": [
    {
      "key_id": "4k8ikoyC2Xh+8BiIeQ+ob7Hcd2J7/Vj3uM61dy9iRMI=",
      "value": `EvGSD2vi8qYcveHnb-rrlok07qnCXjn8YSeCDDXlbhILSabgvNsPpbe76up8w63i2f
	      WHvLKJzeGLKfyHg8ZomQ`
    }
  ]
};

tape.test('magic key to RSA', t => {
  const rsa = magic.magicToRSA(GENKEYM);
  t.ok(rsa);
  t.equal(rsa.n.toString(16), "bacd72b6ba391f24d7dc8e15a8564350a28227eced6ea255dbad4e197ed3ffe1ff14b47b462ba0e81b9fa77f1261745caf1f62b59b75df6141348f0fbb9961979b4f7ca3fb66d1eb1fd71ebb509195a71073b0b94e42b67b96ee33df637483508321aff42e1973a31e19c2591f93a1a5a21b4272ac5af535098c7ab64423aa9a4790b3adc5d39f727ffba7640fbd8f7cc3a181d9c644de6873a85ed6a75246578ceeca31764d2edb20fd9d993aa9b46bc8c5cab1a0ba1c1ce2321dfc4d0db059af242ea9c1101072d3eea2155b0363585b0b11515c419b88634844e4e7aa7477620cff248ebd9d9944f451e9ccee8348c5cb94e0c5e8566ed503437907d6fd07");
  t.equal(rsa.e.toString(16), "010001");

  const priv = magic.magicToRSA(TEST_PRIVATE_KEY);
  t.equal(priv.n.toString(16), "995818f1137a511053b2d9ddbe65143dbe14653770bf099d752284e73fe3bca5042baca4d6edebac2f7237c93a1629468fd2b479e50f7b685fe0f8fee42987c3");
  t.equal(priv.e.toString(16), "010001");
  t.equal(priv.d.toString(16), "2e0cbfc8bde1b0b06782415d0f0d49cbd4e64913221faca28587ad43c8f2fa365776c65777c579b9bde4b811c7938337f62dd376e22472b8dcb225906fbec3f1");

  t.end();
});

tape.test('convert to XML', t => {
  const result = magic.toXML(MAGICJSON);
  t.ok(result);

  t.deepEqual(magic.fromXML(result), MAGICJSON);
  t.end();
});

tape.test('sign', t => {
  const result = magic.sign({ data: 'Hello, World!', data_type: 'text/plain' }, GENKEY);
  t.ok(result);
  const verified = magic.verify(magic.fromXML(GENERATEDXML), GENKEYM);
  t.ok(verified);
  t.end();
});

tape.test('convert from XML', t => {
  const result = magic.fromXML(XML);
  t.ok(result);
  t.equal(
    result.data.replace(/[\n\t ]/g, ''), `
      PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz4KPGVudHJ5IHhtbG5zPS
      dodHRwOi8vd3d3LnczLm9yZy8yMDA1L0F0b20nPgogIDxpZD50YWc6ZXhhbXBsZS5jb20s
      MjAwOTpjbXQtMC40NDc3NTcxODwvaWQ-ICAKICA8YXV0aG9yPjxuYW1lPnRlc3RAZXhhbX
      BsZS5jb208L25hbWUPHVyaT5hY2N0OmpwYW56ZXJAZ29vZ2xlLmNvbTwvdXJpPjwvYXV0a
      G9yPgogIDx0aHI6aW4tcmVwbHktdG8geG1sbnM6dGhyPSdodHRwOi8vcHVybC5vcmcvc3l
      uZGljYXRpb24vdGhyZWFkLzEuMCcKICAgICAgcmVmPSd0YWc6YmxvZ2dlci5jb20sMTk5O
      TpibG9nLTg5MzU5MTM3NDMxMzMxMjczNy5wb3N0LTM4NjE2NjMyNTg1Mzg4NTc5NTQnPnR
      hZzpibG9nZ2VyLmNvbSwxOTk5OmJsb2ctODkzNTkxMzc0MzEzMzEyNzM3LnBvc3QtMzg2M
      TY2MzI1ODUzODg1Nzk1NAogIDwvdGhyOmluLXJlcGx5LXRvPgogIDxjb250ZW50PlNhbG1
      vbiBzd2ltIHVwc3RyZWFtITwvY29udGVudD4KICA8dGl0bGUU2FsbW9uIHN3aW0gdXBzdH
      JlYW0hPC90aXRsZT4KICA8dXBkYXRlZD4yMDA5LTEyLTE4VDIwOjA0OjAzWjwvdXBkYXRl
      ZD4KPC9lbnRyeT4KICAgIA`.replace(/[\n\t ]/g, '')
  );
  t.equal(result.alg, 'RSA-SHA256');
  t.equal(result.data_type, 'application/atom+xml');
  t.equal(result.sigs[0].key_id, '4k8ikoyC2Xh+8BiIeQ+ob7Hcd2J7/Vj3uM61dy9iRMI=');
  t.equal(result.sigs[0].value.replace(/[\n\r ]/g, ''), `EvGSD2vi8qYcveHnb-rrlok07qnCXjn8YSeCDDXlbhILSabgvNsPpbe76up8w63i2fWHvLKJzeGLKfyHg8ZomQ`);
  t.equal(result.encoding, 'base64url');
  t.end();
});

const GENERATEDXML = `<?xml version="1.0"?>
<me:env xmlns:me="http://salmon-protocol.org/ns/magic-env">
  <me:data type="application/atom+xml">TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQ=</me:data>
  <me:encoding>base64url</me:encoding>
  <me:alg>RSA-SHA256</me:alg>
  <me:sig>eTLjKy4MQ53Eldgcn8ukadX4iXqh7iFUDqF27Zry3yCwOQxzhbTuG_sQSQ1shOdU175oQbi5_wIVC-G9gi_JWGuUN2k3cBooCuMfMG2T5fDZaKKpEs9PJv0zJqXloC56oqlsZXJ__G6wunyFqok_f1JMgcSIAyZJMrvMzTYDmC_O71-QACE948Epx-Moo7kexrg1d_JYLli4oYhkV9VhI1xkn77qiDgkXC50vz7Qz_v4ruyZU-7k4Z_CGdCcHzvrGCRGFrY2mHzNkPm7fLc5Hk6_1Sg6ZOx3JdawT0Ov9MlgxyhK28-naT0kaZkCZSDByjqTqPO0DsJbd-iRyGv0GQ==</me:sig>
</me:env>`;

const GENKEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAus1ytro5HyTX3I4VqFZDUKKCJ+ztbqJV261OGX7T/+H/FLR7
Riug6Bufp38SYXRcrx9itZt132FBNI8Pu5lhl5tPfKP7ZtHrH9ceu1CRlacQc7C5
TkK2e5buM99jdINQgyGv9C4Zc6MeGcJZH5OhpaIbQnKsWvU1CYx6tkQjqppHkLOt
xdOfcn/7p2QPvY98w6GB2cZE3mhzqF7Wp1JGV4zuyjF2TS7bIP2dmTqptGvIxcqx
oLocHOIyHfxNDbBZryQuqcEQEHLT7qIVWwNjWFsLEVFcQZuIY0hE5OeqdHdiDP8k
jr2dmUT0UenM7oNIxcuU4MXoVm7VA0N5B9b9BwIDAQABAoIBAGVX/qs5vrGxyFaE
0yUfn6eIcrp8ZJfIBHKIxD06vIMvNbci71ozYzlpeyVg4DT07y+nBGNocvt8hOah
0rRBU1vvy6DgSg0PR9NfXvHalREusNNDBlV6Bgxo5tRHlmpor25lAVOlCvPchAEP
mlByRJlaqBVVp0I1k8+ZYh2uO/dajF3ip1+rkPBXpHOvVYU2nYYpBgnRDdTeQcId
tVUmmMB8vwmDbNpZP/4p4ss5Uflhr+8AtA6lnIb92oBdhYXSBH/A2h8YVtD6dT1s
20zaAofCOwBojm3M7JdrVhUEXsJ3jFdo1SfZHttIZksqX2SNi0tH2imkPWDXq/B4
F4bqEfECgYEA52hsVGR2PwerntEKvxRY1rdL3LEVBIiYotUeupl71LsXMj6WlUYC
jKfJIwGKHQB2NyZRCVd+5Y/ioo6G6sbQmgzXMjD6EItjsLMVfbh4poe71smKKtT7
cP+oDATu0Kxjgj/M68573aHb0WfZB/ghjh7bzD8gRXMfHLSpBqDeXdkCgYEAzqeD
AeWJo3clDkgekWD8+G0hAPJ3uZXtmvOGcbqtSA0wQGu0he8PJMR2ITsssUn0VdmP
pz1RR7nUpQIIpDLYu72JRg6sVF0VBpdme+5V1eizZvqeH/JziMRREy4EngdsCKXp
PpXcT0KbWIeMfCJCe1I4FYSTx6TXxlxTlVn+Bd8CgYA7HJSXljYScb4oSpPpLaRn
7NinHmEVEGOVLMW1uuFD/Sq2vgAvT3v1PCMIGyuRrv2DpvkKXtxefbvR9ICIVpMQ
1vjdrF8kfMbRa12xCL9hIskb2828lT1JpzThJR1wFqkwq2WIUu2XNvJ08ochHwRL
Tpys9u8ibn7jEU8gD1XeOQKBgHZvmq2jl9aPmjUtMBextknKgXfBfsxmGN8NYqgb
jOQWaukA0V1RPSSdU/aHq32QHPB219XJVqP85NoM6FbyrTQr1FjKYAmZr0svyhSM
67TEwMzsJWO52G0x1iVf4lWPe2MZcyvjR3hFfDKovOMH34I+BNaQPQHWf7O3hk+6
W9ORAoGBAJLNBkX/+p4g9phA55hB5Js11pyfDo5TCHmLUzR+e+dbTXWBDTLpOfUZ
3P+uDDaWXvgaAGNQxsqVXsSE738zWl8OqRwTjY5VAvPR0aYa8wN2kNCwLF2t/ITQ
oxQM77DFeNPJCKy4T6rKUNb7P19USWN9yQntA8vM/pYIBlnsVFbw
-----END RSA PRIVATE KEY-----`;

const GENKEYM = 'RSA.' + magic.btob64u(new Buffer("BACD72B6BA391F24D7DC8E15A8564350A28227ECED6EA255DBAD4E197ED3FFE1FF14B47B462BA0E81B9FA77F1261745CAF1F62B59B75DF6141348F0FBB9961979B4F7CA3FB66D1EB1FD71EBB509195A71073B0B94E42B67B96EE33DF637483508321AFF42E1973A31E19C2591F93A1A5A21B4272AC5AF535098C7AB64423AA9A4790B3ADC5D39F727FFBA7640FBD8F7CC3A181D9C644DE6873A85ED6A75246578CEECA31764D2EDB20FD9D993AA9B46BC8C5CAB1A0BA1C1CE2321DFC4D0DB059AF242EA9C1101072D3EEA2155B0363585B0B11515C419B88634844E4E7AA7477620CFF248EBD9D9944F451E9CCEE8348C5CB94E0C5E8566ED503437907D6FD07", 'hex')) + '.' + 'AQAB'

tape.test('verify', t => {
  const result = magic.verify(magic.fromXML(GENERATEDXML), GENKEYM);
  t.ok(result);
  t.end();
});

tape.test('pem to magic', t => {
  const key = magic.RSAToMagic(GENKEY);
  t.equal(key.indexOf(GENKEYM), 0);
  t.end();
});

tape.test('generate', t => {
  const key = magic.generate(512);

  key.then(key => {
    t.ok(key.public_key);
    t.ok(key.private_key);
    t.equal(key.private_key.indexOf(key.public_key), 0);
    t.ok(key.private_key.length > key.public_key.length);
  })
    .catch(err => t.error(err))
    .then(() => t.end());
});
