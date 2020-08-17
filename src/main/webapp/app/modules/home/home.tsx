import './home.scss';

import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { Box, Button, Card, CardContent } from '@material-ui/core';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const [stock, setStock] = useState<Array<object>>();
  const [token, setToken] = useState<string>('');
  const [doneLoading, setDondeLoading] = useState<boolean>(false);

  useEffect(() => {
    let idToken: string = window.sessionStorage['jhi-authenticationToken'];
    if (idToken) {
      idToken = idToken.slice(1, -1);
    }
    setToken(idToken);

    const getData = async () => {
      const request = await fetch(`http://localhost:9000/api/product-buckets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data: Array<object> = await request.json();
      data.sort((a, b) => {
        return a.id - b.id;
      });
      setStock(data);
      global.console.log(data);
      setDondeLoading(true);
    };
    getData();
  }, []);

  const handleAddProduct = async bucket => {
    const productBucket = { ...bucket };
    productBucket.availableToSellQuantity++;

    await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'PUT',
      body: JSON.stringify(productBucket),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const request = await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Array<object> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);
  };

  const handleSellProduct = async bucket => {
    const productBucket = { ...bucket };
    productBucket.availableToSellQuantity--;
    productBucket.inChargeQuantity++;

    await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'PUT',
      body: JSON.stringify(productBucket),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const request = await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Array<object> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);
  };

  const handleBrokenProduct = async bucket => {
    const productBucket = { ...bucket };
    productBucket.availableToSellQuantity--;
    productBucket.brokenQuantity++;

    await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'PUT',
      body: JSON.stringify(productBucket),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const request = await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Array<object> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);
  };

  const handleRefundProduct = async bucket => {
    const productBucket = { ...bucket };
    productBucket.availableToSellQuantity++;
    productBucket.inChargeQuantity--;

    await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'PUT',
      body: JSON.stringify(productBucket),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const request = await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Array<object> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);
  };

  const handleRepairProduct = async bucket => {
    const productBucket = { ...bucket };
    productBucket.availableToSellQuantity++;
    productBucket.brokenQuantity--;

    await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'PUT',
      body: JSON.stringify(productBucket),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const request = await fetch(`http://localhost:9000/api/product-buckets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Array<object> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);
  };

  return (
    <Row>
      <Col md="9">
        <h2>Control de Stock</h2>

        {account && account.login && doneLoading ? (
          <React.Fragment>
            <div>Acá van las cards de productos</div>
            {stock.map(bucket => (
              <Card key={bucket.id}>
                <Box display="flex" justifyContent="center">
                  <CardContent>
                    <h5>{bucket.product.name}</h5>
                    <Box display="flex">
                      <div>
                        <p>Disponible: {bucket.availableToSellQuantity}</p>
                        <Button className="d-block" onClick={() => handleAddProduct(bucket)}>
                          Agregar Producto
                        </Button>
                        <Button className="d-block" onClick={() => handleSellProduct(bucket)}>
                          Vender
                        </Button>
                        <Button className="d-block" onClick={() => handleBrokenProduct(bucket)}>
                          Mandar a Reparación
                        </Button>
                      </div>
                      <div>
                        <p>Encargado: {bucket.inChargeQuantity}</p>
                        <Button className="d-block" onClick={() => handleRefundProduct(bucket)}>
                          Cancelar Venta
                        </Button>
                      </div>
                      <div>
                        <p>Roto: {bucket.brokenQuantity}</p>
                        <Button className="d-block" onClick={() => handleRepairProduct(bucket)}>
                          Reparar
                        </Button>
                      </div>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            ))}
          </React.Fragment>
        ) : (
          <div>
            <h3>Por favor inicia sesión con las credenciales de administrador</h3>
          </div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
