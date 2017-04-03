const tape = require('tape');
const magic = require('../');

const TEST_PUBLIC_KEY = 'RSA.mVgY8RN6URBTstndvmUUPb4UZTdwvwmddSKE5z_jvKUEK6yk1' +
  'u3rrC9yN8k6FilGj9K0eeUPe2hf4Pj-5CmHww==' +
  '.AQAB' +
  '.Lgy_yL3hsLBngkFdDw1Jy9TmSRMiH6yihYetQ8jy-jZXdsZXd8V5' +
  'ub3kuBHHk4M39i3TduIkcrjcsiWQb77D8Q==';

const TEST_PRIVATE_KEY = 'RSA.mVgY8RN6URBTstndvmUUPb4UZTdwvwmddSKE5z_jvKUEK6yk1' +
  'u3rrC9yN8k6FilGj9K0eeUPe2hf4Pj-5CmHww==' +
  '.AQAB' +
  '.Lgy_yL3hsLBngkFdDw1Jy9TmSRMiH6yihYetQ8jy-jZXdsZXd8V5' +
  'ub3kuBHHk4M39i3TduIkcrjcsiWQb77D8Q==';

const TEST_ATOM = `<?xml version='1.0' encoding='UTF-8'?>
<entry xmlns='http://www.w3.org/2005/Atom'>
  <id>tag:example.com,2009:cmt-0.44775718</id>
  <author><name>test@example.com</name><uri>acct:test@example.com</uri>
  </author>
  <content>Salmon swim upstream!</content>
  <title>Salmon swim upstream!</title>
  <updated>2009-12-18T20:04:03Z</updated>
</entry>`;

const TEST_NON_ATOM = 'Some aribtrary string.';

const TEST_ENVELOPE = {
  data: `PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz4KPGVu
    dHJ5IHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDA1L0F0b20nPgog
    IDxpZD50YWc6ZXhhbXBsZS5jb20sMjAwOTpjbXQtMC40NDc3NTcxODwv
    aWQ-CiAgPGF1dGhvcj48bmFtZT50ZXN0QGV4YW1wbGUuY29tPC9uYW1l
    Pjx1cmk-YWNjdDp0ZXN0QGV4YW1wbGUuY29tPC91cmk-CiAgPC9hdXRo
    b3I-CiAgPGNvbnRlbnQ-U2FsbW9uIHN3aW0gdXBzdHJlYW0hPC9jb250
    ZW50PgogIDx0aXRsZT5TYWxtb24gc3dpbSB1cHN0cmVhbSE8L3RpdGxl
    PgogIDx1cGRhdGVkPjIwMDktMTItMThUMjA6MDQ6MDNaPC91cGRhdGVk
    Pgo8L2VudHJ5Pgo=`,
  data_type: 'application/atom+xml',
  alg: 'RSA-SHA256',
  encoding: 'base64url',
  sigs: [
    {
      value: `RL3pTqRn7RAHoEKwtZCVDNgwHrNB0WJxFt8fq6l0HAGcIN4BLYzUC5hp
	GySsnow2ibw3bgUVeiZMU0dPfrKBFA==`
    }
  ]
};

const TEST_NON_ATOM_ENVELOPE = {
  data: 'U29tZSBhcmlidHJhcnkgc3RyaW5nLg==',
  data_type: 'text/plain',
  encoding: 'base64url',
  alg: 'RSA-SHA256',
  sigs: [
    {
      value: `hmx89hQgxhGqWHWh_vK8W0_-9agxSkTQ8w1DUXt6BzZ7oY2iZM89p7mS
	TJJfeR4qNTWMGqTtTtmg0Caro1tRgA==`
    }
  ]
};

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

tape.test('convert to XML', t => {
	const result = magic.toXML(MAGICJSON);
	t.ok(result);

	t.deepEqual(magic.fromXML(result), MAGICJSON);
	t.end();
});

tape.test('sign', t => {
	const result = magic.sign(``);
	t.ok(result);
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

tape.test('verify', t => {
	//const result = magic.verify(``);
	//t.ok(result);
	t.fail();
	t.end();
});
