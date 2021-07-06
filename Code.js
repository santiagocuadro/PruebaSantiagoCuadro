const { RSA_PKCS1_OAEP_PADDING } = require('constants')
const { pbkdf2 } = require('crypto')
const fs = require('fs')
const { userInfo } = require('os')
const path = require('path')

function getUsers(filepath) {
    let users = []
    const dir = fs.readdirSync(filepath)
    
    for (const d of dir) {
        const file = fs.readFileSync(path.join(__dirname, filepath, d))
        const content = JSON.parse(file)
        users.push(content)
    }

    return users
}

function readUsers(users) {
    let output = {
        'auth_modules': {},
        'content_modules': {}
    }

    for (let i = 0; i < 20; i++) {
        let currentUser = './u' + i + '.json'
        let authKey = users[i].provider.auth_module
        let contentKey = users[i].provider.content_module

        if (authKey in output.auth_modules) {
            output.auth_modules[authKey].push(currentUser)
        } else {
            output.auth_modules[authKey] = [currentUser]
        }

        if (contentKey in output.content_modules) {
            output.content_modules[contentKey].push(currentUser)
        } else {
            output.content_modules[contentKey] = [currentUser]
        }
    }

    return output
}


const getUsersByModule = (dataset) => {
	let output =[]
    let aux = []
	const authModulesKeys = Object.keys(dataset.auth_modules).sort()
	const contentModulesKeys = Object.keys(dataset.content_modules).sort()

	contentModulesKeys.forEach((contentModuleProvider) => {
		const contentModuleUsers = dataset.content_modules[contentModuleProvider].sort()
        //console.log(contentModuleUsers)

		contentModuleUsers.some((user) => {
			let evaluation = false

			authModulesKeys.forEach((authModuleProvider) => {
				const authModuleHasUser = dataset.auth_modules[authModuleProvider].some(module => {
					return module.includes(user)
				})

				if (authModuleHasUser && !aux.includes(authModuleProvider)) {
					evaluation = true
                    aux.push(authModuleProvider)
					output.push(user)
					return
				}
			})

			return evaluation
		})
	})

	return output
}

const usersResult = getUsers('./users')
const readUsersResult = readUsers(usersResult)
const users = getUsersByModule(readUsersResult)

console.log('Resultado parte A:',readUsersResult)
console.log('Resultado parte B:',users)




