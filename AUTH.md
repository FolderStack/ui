Login example:

https://test.whitepeak.digital/oauth/authorize?client_id=2wKwRXFPhCHF0opHkIDLUo4d9UMV4vpJgV6dcCXx&response_type=code&redirect_uri=https://auth.folderstack.io&state=b3JnPXRlc3Qmb3A9ZXJmZU1oVkY4YVMzZkFOdA==&code_challenge=db8a16caf70ef888a5ef08897e43f30f507222faf452d67ffe0ccc66ae2c98c2&code_challenge_method=s256


So we really just store the OAuth url in the database as:
https://test.whitepeak.digital/

alongside the client ID
2wKwRXFPhCHF0opHkIDLUo4d9UMV4vpJgV6dcCXx

We know that we're expecting an authorization code and
we know what the redirect url is.

The state is of the following form:
org={orgId}&op={operationId}

The operationId is used to identify the code_verifier in the database

When we get the code_verifier, we can exchange the code (w/ the verifier)
for a token and then redirect back to the app identified by org.