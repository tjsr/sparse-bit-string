# sparse-bit-string

Sparse bit string packing for URLs.

This project is code extracted from the pinpanion code when there was a need to pack a large number of integer numbers in to a URL-compatible QR-code string of limited space.  Because you already lose space from the limited length of a QR code being ASCII-encoded, but also having only 64 valid characters in parameters, there is already a 25% loss overhead.  There was a need to pack as many integer values in to that string as efficiently as possible.  Each position in the bit string represents an integer value.

The initial version of this code will just pack and unpack unique integers in to an encoded string, however the intent is for future versions to support features like removing long runs of bits, and chunking the data if that would generate a more efficient set.  This will require the addition of version and header characters to enable the decoder to know what rules to apply to the string.

## Exports

There are four main methods you'll want from this project.

### Basic encoding without compression or headers  
`numberArrayToEncodedString` - Take in input set of numbers and encode it to a character set  
`stringToNumberArray` - Take an input string of characters and decode it to a set of numbers

### Compressed encoding with headers  
`generatedCompressedStringWithHeader(string, [[number, number]])` - Take an input string of numbers and a list of ranges to splice out.  This produces a string with a header block that tells us the number ranges used in the output string, then the encoded data.  
`extractCompressedBitstring(string)` - Take an input string with a header block and a data payload - extracing the number set produced with the above method.

## Building

Run `npm run build`

You can link a local version if need be, using `npm link` from this project and `npm link sparse-bit-set` from the target project.  Then re-build the project when you make changes.

## Testing

Run `npm test`

## Contact

For feature requests contact [Tim Rowe](tim@tjsr.id.au)


