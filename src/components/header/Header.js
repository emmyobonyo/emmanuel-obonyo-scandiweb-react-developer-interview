import { PureComponent } from 'react';
import { Query } from '@apollo/client/react/components';
import { nanoid } from 'nanoid';
import { Link, Routes, Route } from 'react-router-dom';
import GET_CATEGORIES from '../../graphql/getCategories';
import Product from '../Products/Product';
import ProductDetail from '../Products/ProductDetail';
import logo from '../../assets/images/a-logo.png';
import cart from '../../assets/images/cart.png';
import GET_CURRENCIES from '../../graphql/getCurrencies';
import Cart from '../carts/Cart';
import './Header.css';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: 'USD',
      cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]"),
      itemInCart: false,
      total: '$',
    };
  }

  componentDidUpdate() {
    localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
  }

  addToCart = (product) => {
    const alreadyInCart = this.state.cartItems.some(item => item.id === product.id)
    if( alreadyInCart ) {
      this.setState({ itemInCart: true })
      setTimeout(() => {
        this.setState({ itemInCart: false });
      }, 3000)
    } else {
      product.count = 1;
      this.setState(prevState => ({
        cartItems: [...prevState.cartItems, product]
      }))
    }
  }

  removeFromCart = (id) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.filter(item => item.id !== id)
    }))
    localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
  }

  onChange = (event) => {
    const { value } = event.target;
    localStorage.setItem("symbol", `${value}`)
    this.setState({ currency: value});
  }

  increment = (id) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.map((item) => {
        return item.id === id ? {...item, count: item.count + 1} : item
      })
    }))
  }

  decrement = (id) => {
    this.setState(prevState => ({
      cartItems: prevState.cartItems.map((item) => {
        return item.id === id ? {...item, count: item.count - 1} : item
      })
    }))
  }

  getTotal = () => {
    let total = 0
    for(let i = 0; i<this.state.cartItems.length; i++) {
      if (this.state.currency === 'USD') {
        const price = this.state.cartItems[i].prices[0].amount * this.state.cartItems[i].count
        total += price
      } else if (this.state.currency === 'GBP') {
        const price = this.state.cartItems[i].prices[1].amount * this.state.cartItems[i].count
        total += price
      } else if (this.state.currency == 'AUD') {
        const price = this.state.cartItems[i].prices[2].amount * this.state.cartItems[i].count
        total += price
      } else if (this.state.currency == 'JPY') {
        const price = this.state.cartItems[i].prices[3].amount * this.state.cartItems[i].count
        total += price
      } else if (this.state.currency === 'RUB') {
        const price = this.state.cartItems[i].prices[4].amount * this.state.cartItems[i].count
        total += price
      }
    }
     this.setState({
      total: total
     })
  }

  render() {
    this.getTotal();
    console.log(this.state)
    const { currency } = this.state;
    return (
      <div>
        <nav>
          <div className="nav-ul">
            <Query query={GET_CATEGORIES}>
              { ({ loading, data }) => {
                if (loading) return null;
                return data.categories.map((category) => (
                  <Link to={`/${category.name}`} key={nanoid()} className="nav-li">{category.name.toUpperCase()}</Link>
                ));
              }}
            </Query>
          </div>
          <Link to='/'><img src={logo} alt="logo" /></Link>
          <div>
            {/* <Currency /> */}
            <select onChange={this.onChange} value={localStorage.getItem('symbol') || 'USD'}>
               <Query query={GET_CURRENCIES}>
                { ({ loading, data }) => {
                  if (loading) return null;
                  return data.currencies.map((currency) => (
                    <option
                      key={nanoid()}
                      value={currency.label}
                    >
                      {`${currency.symbol} ${currency.label}`}
                    </option>
                  ));
                }}
              </Query>
            </select>
            <Link to='/cart'><img src={cart} alt="cart" /></Link>
          </div>
        </nav>
        { this.state.itemInCart && <p>Item already in cart</p>}
        <Routes>
          <Route path="/" element={<Product homepage="all" currency={currency} addToCart={this.addToCart}/>} />
          <Route path="/:category" element={<Product currency={currency} addToCart={this.addToCart}/>} />
          <Route path="/product/:id" element={ <ProductDetail currency={currency} addToCart={this.addToCart} />} />
          <Route path="/cart" element={ <Cart cartItems={this.state.cartItems} currency={currency} removeFromCart={this.removeFromCart} increment={this.increment} decrement={this.decrement} total={this.state.total} /> }/>
        </Routes>
      </div>
    );
  }
}

export default Header;
