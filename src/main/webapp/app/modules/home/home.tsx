import './home.scss';

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { Box, Button, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

interface Sale {
  id: number;
  product: {
    id: number;
    name: string;
  };
  state: string;
}

const useStyles = makeStyles({
  table: {
    maxWidth: 900,
    margin: 'auto',
  },
  landing: {
    background: 'linear-gradient(#2a6a9e 10%, #fff 95%)',
    textAlign: 'center',
    padding: '40px 0 140px 0',
  },
  home: {
    background: 'linear-gradient(#fff 10%, #2a6a9e 95%)',
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    justifyContent: 'center',
  },
  fixedImg: {
    position: 'fixed',
    top: '100px',
    opacity: '0.3',
  },
  saleStateButton: {
    color: '#fff',
    backgroundColor: '#2a6a9e',
    borderRadius: '20px',
    borderStyle: 'none',
    '&:hover': {
      backgroundColor: '#a3c3db',
    },
    '&:focus': {
      backgroundColor: '#a3c3db',
      outline: 'none',
      boxShadow: '0 0 10px 2px #004f85',
    },
  },
  handlersButton: {
    color: '#fff',
    backgroundColor: '#2a6a9e',
    borderRadius: '20px',
    borderStyle: 'none',
    '&:hover': {
      backgroundColor: '#a3c3db',
    },
    '&:focus': {
      backgroundColor: '#a3c3db',
      outline: 'none',
      boxShadow: '0 0 10px 2px #004f85',
    },
  },
});
export type IHomeProp = StateProps;

export function Home(props: IHomeProp): JSX.Element {
  const { account } = props;
  const [doneLoading, setDoneLoading] = useState<boolean>(false);
  const [sales, setSales] = useState<Array<Sale>>();
  const [salesConditionToShow, setSalesConditionToShow] = useState<Array<Sale>>();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    let idToken: string = window.sessionStorage['jhi-authenticationToken'];
    if (idToken) {
      idToken = idToken.slice(1, -1);
    }
    setToken(idToken);

    async function getSalesData(): Promise<void> {
      const getSales = await fetch(`http://localhost:9000/api/sales`, {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data: Array<Sale> = await getSales.json();
      data.sort((a, b) => {
        return a.id - b.id;
      });
      setSales(data);
      const salesInCharge: Array<Sale> = data.filter((sale: Sale) => sale.state === 'IN_CHARGE');

      setSalesConditionToShow(salesInCharge);

      setDoneLoading(true);
    }

    getSalesData();
  }, []);

  const handleInChargeButton = (): void => {
    const salesInCharge: Array<Sale> = sales.filter((sale: Sale) => sale.state === 'IN_CHARGE');
    setSalesConditionToShow(salesInCharge);
    //  declare type "any" to get rid of error message about symbol.iterator
    const saleStateBtns: any = document.getElementsByClassName('stateBtn');
    for (const btn of saleStateBtns) {
      btn.style.backgroundColor = '#2a6a9e';
      btn.style.boxShadow = 'none';
    }
    document.getElementById('showInChargeBtn').style.backgroundColor = '#a3c3db';
    document.getElementById('showInChargeBtn').style.boxShadow = '0 0 10px 2px #004f85';
  };

  const handleShippedButton = (): void => {
    const salesShipped: Array<Sale> = sales.filter(sale => sale.state === 'SHIPPED');
    setSalesConditionToShow(salesShipped);
    //  declare type "any" to get rid of error message about symbol.iterator
    const saleStateBtns: any = document.getElementsByClassName('stateBtn');
    for (const btn of saleStateBtns) {
      btn.style.backgroundColor = '#2a6a9e';
      btn.style.boxShadow = 'none';
    }
    document.getElementById('showShippedBtn').style.backgroundColor = '#a3c3db';
    document.getElementById('showShippedBtn').style.boxShadow = '0 0 10px 2px #004f85';
  };
  const handleDeliveredButton = (): void => {
    const salesDelivered: Array<Sale> = sales.filter(sale => sale.state === 'DELIVERED');
    setSalesConditionToShow(salesDelivered);
    //  declare type "any" to get rid of error message about symbol.iterator
    const saleStateBtns: any = document.getElementsByClassName('stateBtn');
    for (const btn of saleStateBtns) {
      btn.style.backgroundColor = '#2a6a9e';
      btn.style.boxShadow = 'none';
    }
    document.getElementById('showDeliveredBtn').style.backgroundColor = '#a3c3db';
    document.getElementById('showDeliveredBtn').style.boxShadow = '0 0 10px 2px #004f85';
  };

  const handleSendButton = async (sale: Sale): Promise<void> => {
    const saleToUpdate: Sale = {
      id: sale.id,
      product: {
        id: sale.product.id,
        name: sale.product.name,
      },
      state: 'SHIPPED',
    };

    const updateSale = await fetch(`http://localhost:9000/api/sales`, {
      method: 'put',
      body: JSON.stringify(saleToUpdate),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const getUpdatedSales = await fetch(
      `http://localhost:9000/api/sales
    `,
      {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Array<Sale> = await getUpdatedSales.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setSales(data);
    const salesInCharge: Array<Sale> = data.filter(saleUpdate => saleUpdate.state === 'IN_CHARGE');
    setSalesConditionToShow(salesInCharge);
  };

  const handleReceivedButton = async (sale: Sale): Promise<void> => {
    const saleToUpdate: Sale = {
      id: sale.id,
      product: {
        id: sale.product.id,
        name: sale.product.name,
      },
      state: 'DELIVERED',
    };

    const updateSale = await fetch(`http://localhost:9000/api/sales`, {
      method: 'put',
      body: JSON.stringify(saleToUpdate),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const getUpdatedSales = await fetch(
      `http://localhost:9000/api/sales
    `,
      {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Array<Sale> = await getUpdatedSales.json();
    data.sort((a, b) => {
      return a.id - b.id;
    });
    setSales(data);
    const salesInCharge: Array<Sale> = data.filter(saleUpdate => saleUpdate.state === 'SHIPPED');
    setSalesConditionToShow(salesInCharge);
  };

  const classes = useStyles();

  return account && account.login && doneLoading ? (
    <Row className={classes.home}>
      <img className={classes.fixedImg} src="../../content/images/logo-full-merliontechs.png" alt="Merlion Techs logo" />
      <Col md="9">
        <div>
          <Box display="flex" m={2} justifyContent="space-around">
            <Button
              id="showInChargeBtn"
              className={`${classes.saleStateButton} stateBtn`}
              variant="outlined"
              onClick={handleInChargeButton}
              style={{ backgroundColor: '#a3c3db', boxShadow: '0 0 10px 2px #004f85' }}
            >
              Encargado
            </Button>
            <Button id="showShippedBtn" className={`${classes.saleStateButton} stateBtn`} variant="outlined" onClick={handleShippedButton}>
              En Camino
            </Button>
            <Button
              id="showDeliveredBtn"
              className={`${classes.saleStateButton} stateBtn`}
              variant="outlined"
              onClick={handleDeliveredButton}
            >
              Entregado
            </Button>
          </Box>

          <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nro de Venta</TableCell>
                  <TableCell align="right">ID del Producto</TableCell>
                  <TableCell align="right">Nombre del Producto</TableCell>
                  <TableCell align="right">
                    <i className="fas fa-shipping-fast"></i>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesConditionToShow.map((sale: Sale) => (
                  <TableRow key={sale.id}>
                    <TableCell component="th" scope="row">
                      {sale.id}
                    </TableCell>
                    <TableCell align="right">{sale.product.id}</TableCell>
                    <TableCell align="right">{sale.product.name}</TableCell>
                    {sale.state === 'DELIVERED' ? null : (
                      <TableCell align="right">
                        <Button
                          className={classes.handlersButton}
                          variant="outlined"
                          onClick={sale.state === 'IN_CHARGE' ? () => handleSendButton(sale) : () => handleReceivedButton(sale)}
                        >
                          {sale.state === 'IN_CHARGE' ? 'Enviar' : 'Recibido'}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Col>
    </Row>
  ) : (
    <div className={classes.landing}>
      <img className="loading-logo" src="../../content/images/logo-merliontechs.png" alt="logo-merliontechs" />
      <h1>Bienvenido al Test de Producto de MerlionTechs</h1>
      <div>
        <h4>Por favor inicie sesión con las credenciales de administrador</h4>
      </div>
    </div>
  );
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
