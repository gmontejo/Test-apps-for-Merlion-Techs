import './home.scss';

import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { Button, Card } from '@material-ui/core';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  const [stock, setStock] = useState<Array<object>>();

  useEffect(() => {
    const getData = async () => {
      const request = await fetch(`http://localhost:9000/api/product-buckets`);
      const data = JSON.stringify(request);
      global.console.log(data);
    };
    getData();
  }, []);

  return (
    <Row>
      <Col md="9">
        <h2>Control de Stock</h2>

        {account && account.login ? (
          <div>Acá van las cards de productos</div>
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
