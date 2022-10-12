// ____________DATA____________
const createDATA = () => {
  const fetchData = () => {
    return [
      {
        group: 'coffee',
        id: 'cappuccino',
        displayName: 'Cappuccino',
        prices: [2.501, 3.5],
      },
      {
        group: 'coffee',
        id: 'latte',
        displayName: 'Latte',
        prices: [2.5, 3.5],
      },
      {
        group: 'coffee',
        id: 'flat-white',
        displayName: 'Flat White',
        prices: [2.5, 4.5],
      },
      {
        group: 'cake',
        id: 'pudding',
        displayName: 'Pudding',
        prices: [2.5, 3.5],
      },
      {
        group: 'cake',
        id: 'donut',
        displayName: 'Donut',
        prices: [2.5, 3.5],
      },
      {
        group: 'pizza',
        id: 'mozzarella',
        displayName: 'Mozzarella',
        prices: [2.5, 3.5],
      },
      {
        group: 'pizza',
        id: 'pepperoni',
        displayName: 'Pepperoni',
        prices: [2.5, 3.5],
      },
    ]
  }

  const data = fetchData()

  const icons = {
    coffee: 'fa-coffee',
    cake: 'fa-birthday-cake',
    pizza: 'fa-pizza-slice',
  }

  const orders = []

  const addOrder = (id, priceIndex) => {
    orders.push({
      id: id,
      price: priceIndex,
    })
  }

  const removeOrder = (id, price) => {
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id === id && orders[i].price === price) {
        orders.splice(i, 1)
        return
      }
    }
  }

  const getUniqueOrderIds = () => {
    const result = []
    for (let i = 0; i < orders.length; i++) {
      if (!result.includes(orders[i].id)) {
        result.push(orders[i].id)
      }
    }
    return result
  }
  const getDisplayName = (id) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i].displayName
      }
    }
    return 'not found'
  }

  const calcOrderPrice = (id) => {
    let result = 0
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id === id) {
        const priceIndex = orders[i].price
        const prices = getDataPrices(id)

        result += prices[priceIndex]
      }
    }
    return result
  }

  const getTotalPrice = () => {
    const ids = getUniqueOrderIds()

    let result = 0
    for (let i = 0; i < orders.length; i++) {
      result += calcOrderPrice(ids[i])
    }
    return result
  }

  const getDataPrices = (id) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i].prices
      }
    }
    return [0, 0]
  }

  const getNumOrderItems = (id) => {
    let result = 0
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id === id) {
        result++
      }
    }
    return result
  }

  const getGroups = () => {
    const result = []

    for (let i = 0; i < data.length; i++) {
      if (!result.includes(data[i].group)) {
        result.push(data[i].group)
      }
    }
    return result
  }

  const getIconForGroup = (group) => {
    return icons[group]
  }

  const getMenuItems = (group) => {
    const result = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].group === group) {
        result.push(data[i])
      }
    }
    return result
  }

  return {
    getTotalPrice: getTotalPrice,
    calcOrderPrice: calcOrderPrice,
    getDisplayName: getDisplayName,
    getUniqueOrderIds: getUniqueOrderIds,
    getNumOrderItems: getNumOrderItems,
    removeOrder: removeOrder,
    addOrder: addOrder,
    getGroups: getGroups,
    getIconForGroup: getIconForGroup,
    getMenuItems: getMenuItems,
  }
}

const data = createDATA()

// _____________SCREEN_____________
var createScreenState = () => {
  const menuScreen = document.querySelector('#menu')
  const homeScreen = document.querySelector('#home')

  const goToMenu = () => {
    homeScreen.classList.remove('active')
    menuScreen.classList.add('active')
  }

  const goToHome = () => {
    menuScreen.classList.remove('active')
    homeScreen.classList.add('active')
  }
  return {
    goToMenu: goToMenu,
    goToHome: goToHome,
  }
}

const screen = createScreenState()

const action = document.querySelector('#home .action')
action.addEventListener('click', () => {
  screen.goToMenu()
})

const back = document.querySelector('#menu .back')

back.addEventListener('click', () => {
  home.updateOrderList()
  screen.goToHome()
})

// __________________MENU______________
const createMenu = () => {
  const groups = data.getGroups()
  const menuLIst = document.querySelector('#menu .menu-id-list-vp>.list')

  const createIconELement = (icon, group) => {
    const template = document.querySelector('#menu-item-button')
    const element = template.content.cloneNode(true)
    const iconEL = element.querySelector('button i')
    const btn = element.querySelector('button')
    iconEL.classList.add(icon)

    btn.addEventListener('click', () => {
      updateList(group)
    })

    return element
  }

  const deselectItems = () => {
    const allItems = document.querySelectorAll('.menu-item-list-vp .item')

    allItems.forEach((item) => {
      item.classList.remove('active')
    })
  }

  const createListElement = (item) => {
    const template = document.querySelector('#menu-item')
    const el = template.content.cloneNode(true)
    const name = el.querySelector('.r1>.name')
    name.innerText = item.displayName

    let activePriceIndex = 0
    const row = el.querySelector('.item')

    row.addEventListener('click', () => {
      deselectItems()
      row.classList.add('active')
    })

    const prices = el.querySelectorAll('.r1>.size')
    for (let i = 0; i < prices.length; i++) {
      prices[i].innerText = item.prices[i].toFixed(2)
    }

    const priceButtons = el.querySelectorAll('.r2>.size')

    const deselectAllPrices = () => {
      priceButtons.forEach((btn) => {
        btn.classList.remove('active')
      })
    }
    priceButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        activePriceIndex = index

        deselectAllPrices()
        btn.classList.add('active')
      })
    })

    const minus = el.querySelector('.minus')
    const plus = el.querySelector('.plus')
    const numEl = el.querySelector('.r2 .num')

    const updateNumItems = () => {
      const numItems = data.getNumOrderItems(item.id)

      if (numItems === 0) {
        numEl.innerText = ''
      } else {
        numEl.innerText = numItems
      }
    }

    updateNumItems()
    minus.addEventListener('click', () => {
      data.removeOrder(item.id, activePriceIndex)
      updateNumItems()
    })

    plus.addEventListener('click', () => {
      data.addOrder(item.id, activePriceIndex)
      updateNumItems()
    })
    return el
  }

  const updateList = (group) => {
    const items = data.getMenuItems(group)
    const menulist = document.querySelector('.menu-item-list-vp')
    menulist.innerHTML = ''

    for (let i = 0; i < items.length; i++) {
      const element = createListElement(items[i])
      menulist.appendChild(element)
    }
  }

  for (let i = 0; i < groups.length; i++) {
    const icon = data.getIconForGroup(groups[i])
    const element = createIconELement(icon, groups[i])
    menuLIst.appendChild(element)
  }
  updateList(groups[0])
}
createMenu()

// _____________HOME_______________
const createHome = () => {
  const orderList = document.querySelector('#home .home-list-vp')

  const createListElement = (displayName, num, price) => {
    const template = document.querySelector('#order-item')
    const el = template.content.cloneNode(true)

    const title = el.querySelector('.title .title')
    const numEl = el.querySelector('.title .subtitle .value')
    const priceEL = el.querySelector('.price .value')

    title.innerText = displayName
    numEl.innerText = num
    priceEL.innerText = price.toFixed(2)

    return el
  }

  const updateOrderList = () => {
    const orders = data.getUniqueOrderIds()
    orderList.innerHTML = ''

    for (let i = 0; i < orders.length; i++) {
      const displayName = data.getDisplayName(orders[i])
      const num = data.getNumOrderItems(orders[i])
      const price = data.calcOrderPrice(orders[i])
      const el = createListElement(displayName, num, price)
      orderList.appendChild(el)
    }
    const total = document.querySelector('#home .footer-bar .price .value')
    total.innerText = data.getTotalPrice().toFixed(2)
  }

  return {
    updateOrderList: updateOrderList,
  }
}
const home = createHome()
