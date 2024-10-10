import { menuArray, OrderedItem } from "./data.js";
const orderedItemsList = document.getElementById("ordered-items-list")
const orderedItemsSect = orderedItemsList.parentElement
const paymentModal = document.getElementById('payment-modal')
const form = paymentModal.children[1]
const thanksSect = document.getElementById('thanks-section')
const ratingDiv = thanksSect.firstElementChild.lastElementChild
const state = {
    currentId: 0,
    orderedItems: new Set(),
    newId() {
        return this.currentId++
    }
}

document.getElementById('items-list').innerHTML = getItemsListHtml(menuArray)

document.addEventListener("click", function (e) {
    if (e.target.dataset.add) {
        handleAddClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.id === 'order-btn') {
        handleOrderClick()
    }
})


function handleOrderClick() {
    paymentModal.classList.remove('hidden')
    form.addEventListener('submit', handlePayClick)
}

function handlePayClick(e) {
    e.preventDefault()

    const formData = new FormData(form)

    const name = formData.get('name')

    state.orderedItems.clear()
    orderedItemsSect.classList.add('hidden')
    paymentModal.classList.add('hidden')
    thanksSect.firstElementChild.firstElementChild.textContent =
        `Thanks, ${name}! Your order is on its way!`
    thanksSect.classList.remove('hidden')
    ratingDiv.addEventListener('click', onRatingClicked)
}

function onRatingClicked(e) {
    if (e.target.id) {
        const rating = e.target.id.slice(-1)
        ratingDiv.innerHTML = getRatingHtml(rating)
    }
}

function getRatingHtml(rating) {
    let html = ""
    for (let i = 0; i < 5; i++) {
        html += `<i id="star-${i + 1}" 
        class="fa-${i < rating ? 'solid' : 'regular'} fa-star"></i>`
    }
    return html
}

function handleRemoveClick(orderedItemId) {
    deleteItem(orderedItemId)
    if (!state.orderedItems.size) {
        orderedItemsSect.classList.remove("hidden")
    } else {
        renderOrderedItemsList()
    }
}

function deleteItem(itemId) {
    state.orderedItems.delete(findOrderedItem(itemId))
}

function findOrderedItem(itemId) {
    for (let item of state.orderedItems) {
        if (item.id == itemId) {
            return item
        }
    }
}

function handleAddClick(itemId) {
    thanksSect.classList.add('hidden')
    state.orderedItems.size === 0
        && orderedItemsSect.classList.toggle("hidden")
    state.orderedItems.add(new OrderedItem(menuArray[itemId], state.newId()))
    renderOrderedItemsList()
}

function renderOrderedItemsList() {
    orderedItemsList.innerHTML =
        getOrderedItemsListHtml(Array.from(state.orderedItems))
}

function getOrderedItemsListHtml(items) {
    const hasDisc = hasDiscount(items)
    const discount = hasDisc ? 0.1 : 0
    return items.map((item) =>
        orderedItemHtml(item)
    ).join('') +
        `<li class="ordered-item total-price">
        <p>Total price:</p>
        <p class="item-price">${hasDisc ? '(-10%) ' : ''}
        $${(items.reduce((tot, cur) => tot + cur.price, 0) * (1 - discount)).toFixed(2)}
        </p>
    </li>`
}

function orderedItemHtml(item) {
    return `<li id="${item.id}" class="ordered-item">
        <p>${item.name}</p>
        <button data-remove="${item.id}" class="item-remove-btn">remove</button>
        <p class="item-price">$${item.price}</p>
    </li>`
}

function hasDiscount(items) {
    return items.find((item) => item.name === 'Pizza'
        || item.name == 'Hamburger')
        && items.find((item) => item.name === 'Beer')
}

function getItemsListHtml(items) {
    return items.map((item) =>
        `<ul id="items-list" class="items-list">
    <li class="item">
        <div class="item-image">
            ${item.emoji}
        </div>
        <div class="item-text">
            <p class="item-name">${item.name}</p>
            <p class="item-ingredients">${item.ingredients.join(",")}</p>
            <p class="item-price">$${item.price}</p>
        </div>
        <button class="item-add-btn">
            <i class="fa-solid fa-plus" data-add="${item.id}"></i>
        </button>
    </li>
</ul>`
    ).join('')
}