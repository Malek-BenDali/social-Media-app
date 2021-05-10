const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info('Hello logs!', { structuredData: true })
	response.send('Hello from leute!')
})

exports.getScreams = functions.https.onRequest((request, response) => {
	admin
		.firestore()
		.collection('Screams')
		.get()
		.then(data => {
			let screams = []
			data.forEach(doc => {
				screams.push(doc.data())
			})
			return response.json(screams)
		})
		.catch(err => console.log(err))
})

exports.createScream = functions.https.onRequest((request, response) => {
	const { body, userHandle } = request.body
	const newScream = {
		body,
		userHandle,
		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
	}

	admin
		.firestore()
		.collection('Screams')
		.add(newScream)
		.then(doc => {
			return response.json({
				message: `document ${doc.id} created successfully`,
			})
		})
		.catch(err => {
			response.status(500).json({ error: 'something went wrong' })
		})
})
