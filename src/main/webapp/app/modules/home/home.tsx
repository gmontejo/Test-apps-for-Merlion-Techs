import './home.scss';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Button, Card, CardContent } from '@material-ui/core';

export type IHomeProp = StateProps;

const useStyles = makeStyles({
  landing: {
    background: 'linear-gradient(#004f85 5%, #fff 100%)',
    textAlign: 'center',
    padding: '50px 0 50px 0',
  },
  card: {
    background: 'linear-gradient(45deg, #fff 25%, #004f85 90%)',
    border: 0,
    borderRadius: 3,
    margin: '5px',
  },
  fixedSide: {
    position: 'fixed',
    left: '15px',
    color: '#fff',
  },
  fixedImg: {
    maxWidth: '25%',
    height: 'auto',
  },
  img: {
    maxWidth: '100%',
  },
  button: {
    display: 'block',
    color: '#fff',
    margin: '5px',
    backgroundColor: '#004f85',
    '&:hover': {
      backgroundColor: '#57aae3',
      borderColor: '#57aae3',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
  },
  bucketTitle: {
    padding: '10px',
    borderBottom: '1px solid black',
  },
  bucketStyle: {
    backgroundColor: 'rgb(163,195,219, 0.8)',
    boxShadow: '0 0 5px 0',
    minWidth: '200px',
    margin: '8px',
    padding: '5px',
    borderRadius: '5%',
  },
});

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const [stock, setStock] = useState<Array<Bucket>>();
  const [token, setToken] = useState<string>('');
  const [doneLoading, setDondeLoading] = useState<boolean>(false);
  const classes = useStyles();

  interface Bucket {
    id: number;
    availableToSellQuantity: number;
    inChargeQuantity: number;
    brokenQuantity: number;
    product: {
      id: number;
      name: string;
    };
  }

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
      const data: Array<Bucket> = await request.json();
      data.sort((a, b) => {
        return a.id - b.id;
      });
      setStock(data);
      global.console.log(data);
      setDondeLoading(true);
    };
    getData();
  }, []);

  const handleAddProduct = async (bucket: Bucket) => {
    const productBucket: Bucket = { ...bucket };
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
    const data: Array<Bucket> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);

    document.getElementById(`availableQuantity${bucket.id}`).style.color = '#17bf63';
    setTimeout(() => {
      document.getElementById(`availableQuantity${bucket.id}`).style.color = 'black';
    }, 250);
  };

  const handleSellProduct = async (bucket: Bucket) => {
    const productBucket: Bucket = { ...bucket };
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
    const data: Array<Bucket> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);

    document.getElementById(`availableQuantity${bucket.id}`).style.color = 'red';
    document.getElementById(`inChargeQuantity${bucket.id}`).style.color = '#17bf63';
    setTimeout(() => {
      document.getElementById(`availableQuantity${bucket.id}`).style.color = 'black';
      document.getElementById(`inChargeQuantity${bucket.id}`).style.color = 'black';
    }, 250);
  };

  const handleBrokenProduct = async (bucket: Bucket) => {
    const productBucket: Bucket = { ...bucket };
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
    const data: Array<Bucket> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);

    document.getElementById(`availableQuantity${bucket.id}`).style.color = 'red';
    document.getElementById(`brokenQuantity${bucket.id}`).style.color = '#17bf63';
    setTimeout(() => {
      document.getElementById(`availableQuantity${bucket.id}`).style.color = 'black';
      document.getElementById(`brokenQuantity${bucket.id}`).style.color = 'black';
    }, 250);
  };

  const handleRefundProduct = async (bucket: Bucket) => {
    const productBucket: Bucket = { ...bucket };
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
    const data: Array<Bucket> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);

    document.getElementById(`inChargeQuantity${bucket.id}`).style.color = 'red';
    document.getElementById(`availableQuantity${bucket.id}`).style.color = '#17bf63';
    setTimeout(() => {
      document.getElementById(`inChargeQuantity${bucket.id}`).style.color = 'black';
      document.getElementById(`availableQuantity${bucket.id}`).style.color = 'black';
    }, 250);
  };

  const handleRepairProduct = async (bucket: Bucket) => {
    const productBucket: Bucket = { ...bucket };
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
    const data: Array<Bucket> = await request.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setStock(data);

    document.getElementById(`brokenQuantity${bucket.id}`).style.color = 'red';
    document.getElementById(`availableQuantity${bucket.id}`).style.color = '#17bf63';
    setTimeout(() => {
      document.getElementById(`brokenQuantity${bucket.id}`).style.color = 'black';
      document.getElementById(`availableQuantity${bucket.id}`).style.color = 'black';
    }, 250);
  };

  return account && account.login && doneLoading ? (
    <Row style={{ background: 'linear-gradient(105deg, #004f85 10%, #fff 95%)' }}>
      <Col md="3">
        <div className={classes.fixedSide}>
          <h2>Control de Stock</h2>
          <img className={classes.fixedImg} src="../../content/images/logo-merliontechs.png" alt="merlionTechs logo" />
        </div>
      </Col>
      <Col md="9">
        <React.Fragment>
          {stock.map(bucket => (
            <Card className={classes.card} key={bucket.id}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <img className={classes.img} src={`../../content/images/product-${bucket.id}.jpg`} alt="product-image" />
                  </Grid>
                  <Grid item xs={9}>
                    <h4>{bucket.product.name}</h4>
                    <Box display="flex">
                      <div className={classes.bucketStyle}>
                        <h5 className={classes.bucketTitle}>
                          Disponible: <strong id={`availableQuantity${bucket.id}`}>{bucket.availableToSellQuantity}</strong>
                        </h5>
                        <Button variant="contained" className={classes.button} onClick={() => handleAddProduct(bucket)}>
                          Agregar Producto
                        </Button>
                        <Button variant="contained" className={classes.button} onClick={() => handleSellProduct(bucket)}>
                          Vender
                        </Button>
                        <Button variant="contained" className={classes.button} onClick={() => handleBrokenProduct(bucket)}>
                          Mandar a Reparación
                        </Button>
                      </div>
                      <div className={classes.bucketStyle}>
                        <h5 className={classes.bucketTitle}>
                          Encargado: <strong id={`inChargeQuantity${bucket.id}`}>{bucket.inChargeQuantity}</strong>
                        </h5>
                        <Button variant="contained" className={classes.button} onClick={() => handleRefundProduct(bucket)}>
                          Cancelar Venta
                        </Button>
                      </div>
                      <div className={classes.bucketStyle}>
                        <h5 className={classes.bucketTitle}>
                          Roto: <strong id={`brokenQuantity${bucket.id}`}>{bucket.brokenQuantity}</strong>
                        </h5>
                        <Button variant="contained" className={classes.button} onClick={() => handleRepairProduct(bucket)}>
                          Reparar
                        </Button>
                      </div>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </React.Fragment>
      </Col>
    </Row>
  ) : (
    <div className={classes.landing}>
      <img className={classes.fixedImg} src="../../content/images/logo-merliontechs.png" alt="merlionTechs logo" />
      <h3>Bienvenidos al Bonus Test de Producto</h3>
      <h5>Por favor inicia sesión con las credenciales de administrador</h5>
    </div>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
