import { PureComponent } from "react";
import { useParams } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import GET_PRODUCT from "../../graphql/getProduct";


class ProductDetail extends PureComponent {
  render() {
    const { id } = this.props.params;
    const { currency } = this.props;
    const chooseCurrency = (currency, product) => {
      if (currency === 'USD') {
        return (
          <div>
            <span>{product.prices[0].currency.symbol}</span>
            <span>{product.prices[0].amount}</span>
          </div>
        );
      } else if (currency === 'GBP') {
        return (
          <div>
            <span>{product.prices[1].currency.symbol}</span>
            <span>{product.prices[1].amount}</span>
          </div>
        )
      } else if (currency == 'AUD') {
        return (
          <div>
            <span>{product.prices[2].currency.symbol}</span>
            <span>{product.prices[2].amount}</span>
          </div>
        )
      } else if (currency == 'JPY') {
        return (
          <div>
            <span>{product.prices[2].currency.symbol}</span>
            <span>{product.prices[2].amount}</span>
          </div>
        )
      } else if (currency === 'RUB') {
        return (
          <div>
            <span>{product.prices[3].currency.symbol}</span>
            <span>{product.prices[3].amount}</span>
          </div>
        )
      }
      return null;
    };
    return (
      <Query
        key="yes"
        query={GET_PRODUCT}
        variables={{ id }}
        fetchPolicy="network-only"
      >
        {({ loading, data}) => {
          if (loading) return null;
          return (
            <div>
              { data.product.gallery.map((image) => (
                <img src={image} alt={data.product.name} />
              )) }
              <img src={data.product.gallery[0]} alt={data.product.name} />
              <div>
                <h3>{data.product.brand}</h3>
                <h3>{data.product.name}</h3>
                { data.product.category === 'clothes' && data.product.attributes.length > 0 &&
                  <div>
                    { data.product.attributes.map((item) => (
                      <div>
                        <h3>{item.name}</h3>
                        <div>
                          {item.items.map((itemAttribute) => (
                            <span>{itemAttribute.value}</span>
                          ))}
                        </div>
                      </div>
                    )) }
                    <p>PRICE</p>
                    { chooseCurrency( currency, data.product) }
                    <button type="buton">Add To Cart</button>
                  </div>
                }
                { data.product.category === 'tech' && data.product.attributes.length > 0 &&
                  <div>
                  { data.product.attributes.map((item) => (
                    <div>
                      { item.name === 'Color' &&
                        <div>
                          <h3>{item.name}</h3>
                          <div>
                            {item.items.map((value) => (
                              <span>{value.value}</span>
                            ))}
                          </div>
                        </div>
                      }
                      { item.name === 'Capacity' &&
                        <div>
                          <h3>{item.name}</h3>
                          <div>
                            {item.items.map((value) => (
                              <span>{value.value}</span>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  )) }
                  <p>PRICE</p>
                  { chooseCurrency( currency, data.product) }
                  <button type="buton">Add To Cart</button>
                  <p>{data.product.description}</p>
                </div>
                }
              </div>
            </div>
          )
        }}
      </Query>
    )
  }

}

export default (props) => (
  <ProductDetail
    {...props}
    params={useParams()}
  />
);