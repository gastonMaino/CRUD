const form = document.getElementById('form')
const main = document.getElementById('main')
const buttonUpdate = document.getElementById('buttonupdate')
const buttonAdd = document.getElementById('buttonadd')
let users = []

const getUser = (id) => {
    id = id.substring(id.lastIndexOf('-') + 1)

    const user = users.filter((user, index) => index == id)[0]

    form.name.value = user.nombre
    form.lastname.value = user.apellido
    form.country.value = user.pais

    form.buttonadd.dataset.id = id;

    return id
}

const deleteData = (id) => {
    id = getUser(id)
    const data = {
        id: id
    }
    fetch(`https://bootcamp-dia-3.camilomontoyau.now.sh/usuarios/${data.id}}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            refresh()
        })
        .catch((err) => console.log(`Error ${err}`))
}

const getList = () => {
    const userList = document.getElementById('list')
    const fragment = document.createDocumentFragment()
    users.forEach((user, index) => {
        const itemList = document.createElement('LI')
        itemList.id = `id-${index}`
        itemList.textContent = `Name: ${user.nombre ? user.nombre : 'null'}  - Lastname: ${user.apellido ? user.apellido : 'null'} - Country: ${user.pais ? user.pais : 'null'} `

        const checkOption = document.createElement('INPUT')
        checkOption.setAttribute('type', 'checkbox')
        itemList.appendChild(checkOption)


        const buttonEdit = document.createElement('A')
        buttonEdit.classList.add('button', 'button--edit')
        buttonEdit.id = `edit-user-${index}`
        buttonEdit.setAttribute('href', '#')
        buttonEdit.textContent = 'edit'

        itemList.appendChild(buttonEdit)

        const buttonDelete = document.createElement('A')
        buttonDelete.classList.add('button', 'button--delete')
        buttonDelete.id = `delete-user-${index}`
        buttonDelete.setAttribute('href', '#')
        buttonDelete.textContent = 'delete'

        itemList.appendChild(buttonDelete)

        fragment.appendChild(itemList)
    })
    userList.appendChild(fragment)
}

const refresh = () => {
    fetch('https://bootcamp-dia-3.camilomontoyau.now.sh/usuarios')
        .then((response) => response.json())
        .then((data) => {
            users = data
            getList()
        })
}

const resetForm = () => {
    form.name.value = ''
    form.lastname.value = ''
    form.country.value = ''
}

const updateData = () => {
    const data = {
        id: form.button.dataset.id,
        nombre: form.name.value,
        apellido: form.lastname.value,
        pais: form.country.value
    }
    fetch(`https://bootcamp-dia-3.camilomontoyau.now.sh/usuarios/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            refresh()
            resetForm()
        })
        .catch((err) => console.log(`Error ${err}`))

    buttonAdd.classList.remove('button--hide')
    buttonUpdate.classList.add('button--hide')

}

main.addEventListener('click', (e) => {
    if (e.target.id.indexOf('edit-user') !== -1) {
        const id = getUser(e.target.id)
        buttonUpdate.classList.remove('button--hide')
        buttonAdd.classList.add('button--hide')
    } else if (e.target.id.indexOf('delete-user') !== -1) {
        deleteData(e.target.id)

    } else if (e.target.id == 'button-update') {
        updateData()
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = {
        nombre: form.name.value,
        apellido: form.lastname.value,
        pais: form.country.value
    }
    fetch('https://bootcamp-dia-3.camilomontoyau.now.sh/usuarios', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "content-type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            refresh()
            resetForm()
        })
        .catch((err) => console.log(`Error ${err}`))
})