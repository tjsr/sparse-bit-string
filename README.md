# sparse-bit-string

Sparse bit string packing for URLs.

This project is code extracted from the pinpanion code when there was a need to pack a large number of integer numbers in to a URL-compatible QR-code string of limited space.  Because you already lose space from the limited length of a QR code being ASCII-encoded, but also having only 64 valid characters in parameters, there is already a 25% loss overhead.  There was a need to pack as many integer values in to that string as efficiently as possible.  Each position in the bit string represents an integer value.

The initial version of this code will just pack and unpack unique integers in to an encoded string, however the intent is for future versions to support features like removing long runs of bits, and chunking the data if that would generate a more efficient set.  This will require the addition of version and header characters to enable the decoder to know what rules to apply to the string.

## Building

Run `npm run build`

You can link a local version if need be, using `npm link` from this project and `npm link sparse-bit-set` from the target project.  Then re-build the project when you make changes.

## Testing

Run `npm test`

## Contact

For feature requests contact [Tim Rowe](tim@tjsr.id.au)


