# magic-signatures

Read, validate and write magic-signature signed XML and JSON

Keys are accepted in magic-key or PEM format.

## Use

Verifying a signature:

```
magic.verify(magic.fromXML(magicSignatureEnvelope), magicKey)
```

Signing a payload:

```
magic.sign({
	data: "Hello, world",
	data_type: "text/plain"
}, magicPrivateKey))
```

Parsing an XML payload into the much simpler JSON structure:

```
const obj = magic.fromXML(payload)
```

Building an XML payload from the much simpler JSON structure:

```
const xml = magic.toXML(obj)
```

## References

* [Magic Signatures specification](https://rawgit.com/salmon-protocol/salmon-protocol/master/draft-panzer-magicsig-01.html)
