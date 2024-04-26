import React, { useEffect , useReducer} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import  Message  from '../Components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'
import { useNavigate } from 'react-router-dom'
import { InputGroup, Input, FormControl } from 'react-bootstrap'

const CartScreen = () => {

    // const { id, qty } = useParams()
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch()

    const qty = location.search ? Number(location.search.split('=')[1]) : 1

    const ship = useSelector((state) => state.ship)
    const { cartItems } = ship

   
    useEffect(() => {
      if (id) {
          dispatch(addToCart(id, qty))
      }
      console.log('qty:', qty)
  }, [dispatch, id, qty])
    

    const checkoutHandler = () =>{
        navigate(`/login?redirect=shipping`)
    }

    return (
        <div>
          <Row>
            <Col md={8}>
              <h1>Shopping Cart</h1>
              {cartItems.length === 0 ? (
              <Message variant='info'>Your cart is empty <Link to ='/'> Go back</Link></Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item.product}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                       
                       <Col md={2}>GHS {item.price}</Col>

                     
                        
                       <Col md={2}>
  
    <Form.Control
      as="select"
      value={item.qty}
      
      
      onChange={(e) =>
        dispatch(
          addToCart(item.product, Number(e.target.value))
        )
      }
    >
      {[...Array(item.countInStock).keys()].map((x) => (
        <option key={x + 1} value={x + 1}>
          {x + 1}
        </option>
      ))}
    </Form.Control> 
</Col>

<Col md={1}>
<InputGroup>
    <InputGroup.Text style={{display: 'flex',  flexDirection: 'column'}}>
    <i className="fas fa-chevron-up" onClick={() => dispatch(addToCart(item.product, Math.max(item.qty + 1, 1)))} size='sm'></i>
     <i className="fas fa-chevron-down" onClick={() => dispatch(addToCart(item.product, Math.min(item.qty - 1, item.countInStock)))} size='sm'></i>
    </InputGroup.Text>
    
  </InputGroup>
</Col>
                        
                        <Col md={1}>


                          <Button 
                            type='button'
                            variant='light'
                            onClick={() => dispatch(removeFromCart(item.product))}
                            >
                                <i className='fas fa-trash'></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
          </Col>
          
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                  GHS {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </ListGroup.Item>
                      
                <ListGroup.Item>
                            
                  <Button 
                    variant='primary'
                    type='button'
                    className='btn-block'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >Checkout</Button>
            
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    )
}

export default CartScreen