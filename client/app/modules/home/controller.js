'use strict';

import './styles.css';
import $ from 'jquery';
import axios from 'axios';

export default class HomepageController {
  constructor($scope, $state) {
    this.scope = $scope;
    this.state = $state;
    this.basket = [];
    this.products = [
      {
        "id": 1,
        "name": "Сосиски",
        "description": "Обычные такие сосиски, из мяса.",
        "price": 50
      },
      {
        "id": 2,
        "name": "Хлеб",
        "description": "Ржаной хлеб, нравится голубям.",
        "price": 20
      },
      {
        "id": 3,
        "name": "Сок",
        "description": "Я добрый абрикос.",
        "price": 150
      },
      {
        "id": 4,
        "name": "Сливочное масло",
        "description": "Вологодское. Хорошее.",
        "price": 35
      },
      {
        "id": 5,
        "name": "Мясо",
        "description": "Мясо неизвестного происхождения.",
        "price": 250
      },
    ]
    this.getBasket();
  }

  addToBasket(product, attr) {
    const t = this.basket.find(v => v.id === product.id);
    if (t) {
      if (t.quantity < 10 && attr) {
        t.quantity++;
      }
      if (t.quantity === 1 && !attr) {
        return this.deleteProductFromBasket(t.id);
      }
      if (!attr) {
        t.quantity--;
      }
    } else {
      product.quantity = 1;
      this.basket.push(product);
    }
    this.sendToBasket(product, attr);
  }

  sendToBasket(product) {
    axios.post('http://localhost:8081/api/cart', {
      id: product.id,
      quantity: product.quantity
    })
    .catch((err) => {
      console.log(err);
    });
  }

  deleteProductFromBasket(id) {
    axios.delete(`http://localhost:8081/api/cart/${id}`)
      .then(() => {
        this.basket.map((v, index) => {
          if (v.id === id) this.basket.splice(index, 1);
          return v;
        })
        this.scope.$apply();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  clearBasket() {
    axios.delete('http://localhost:8081/api/cart/clear')
      .then(() => {
        this.basket = [];
        this.scope.$apply();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getBasket() {
    axios.get('http://localhost:8081/api/products')
      .then((data) => {
        data = data.data.data;
        data.map(v => {
          const t = this.products.find(r => r.id === v.id);
          if (t) {
            t.quantity = v.quantity;
            this.basket.push(t);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
