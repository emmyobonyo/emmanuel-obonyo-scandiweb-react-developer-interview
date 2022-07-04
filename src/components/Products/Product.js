/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable operator-linebreak */
import { PureComponent } from 'react';
import { useParams } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import GET_PRODUCTS from '../../graphql/getProducts';

class Product extends PureComponent {
  render() {
    const { category } = this.props.params;
    const { homepage, currency } = this.props;
    const chooseCurrency = (currency, product) => {
      if (currency === 'USD') {
        return (
          <div>
            <span>{product.prices[0].currency.symbol}</span>
            <span>{product.prices[0].amount}</span>
          </div>
        );
      }
      return null;
    };
    return (
      <div>
        <h1>{category}</h1>
        <Query
          key="yes"
          query={GET_PRODUCTS}
          variables={{ input: { title: `${!category ? homepage : category}` } }}
          fetchPolicy="network-only"
        >
          {({ loading, data }) => {
            if (loading) return null;
            return data.category.products.map((product) => (
              <div key={product.id}>
                <img src={product.gallery[0]} alt={`${product.name}`} />
                <p>{product.name}</p>
                { chooseCurrency(currency, product) }
              </div>
            ));
          }}

        </Query>
      </div>
    );
  }
}

export default (props) => (
  <Product
    {...props}
    params={useParams()}
  />
);
