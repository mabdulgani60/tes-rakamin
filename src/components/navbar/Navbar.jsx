import styled from "styled-components";
import React, { Component } from 'react';

const Nav = styled.nav`
  border-bottom: 1px solid #E0E0E0;
  font-family: 'Nunito Sans';
  text-align: left;
`
const Container = styled.div`
  margin: 0 34px;
  padding: 18px 0;
  display: flex;
  gap: 10px;
  align-items: baseline;
`
const Heading = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
`

class Navbar extends Component {
    render(){
        return(
            <Nav>
                <Container>
                    <Heading>Product Roadmap</Heading>
                </Container>
            </Nav>
        );
    }
}

export default Navbar;