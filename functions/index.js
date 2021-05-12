const functions = require('firebase-functions')
const admin = require('firebase-admin')

const app = require('express')()

admin.initializeApp()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get('/screams', (request, response) => {
	admin
		.firestore()
		.collection('Screams')
		.orderBy('createdAt', 'desc')
		.get()
		.then(data => {
			let screams = []
			data.forEach(doc => {
				screams.push({
					screamId: doc.id,
					...doc.data(),
				})
			})
			return response.json(screams)
		})
		.catch(err => console.log(err))
})

app.post('/scream', (request, response) => {
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

exports.api = functions.https.onRequest(app)
