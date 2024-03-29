import React, { useState, useEffect, Fragment } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";
import { updateUserProfile, getUserProfile } from "./apiUser";
import './adminDashboard.css'
import { Button, Container, Divider, Grid, Hidden, TextField, Typography } from "@material-ui/core";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SecurityIcon from '@material-ui/icons/Security';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LockIcon from '@material-ui/icons/Lock';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';


export const UserLinks = () => {
    const {
        user: { _id }
    } = isAuthenticated();

    const toggleMenuView = (event)=>{
        event.preventDefault();
        const userMenu = document.getElementById('admin-links')
        if(userMenu.style.display === ''){
            return userMenu.style.display = 'block';
        }
        if(userMenu.style.display === 'block'){
            return userMenu.style.display = 'none';
        }if(userMenu.style.display === 'none'){
            return userMenu.style.display = 'block';
        }
    }
        return (
            <Fragment>
                {/* <div id="dashboard-menu" className="cursor-pointer" onClick={toggleMenuView}>
                <img src="/images/icons/menu.svg" width="23" /> Dashboard Menu
                </div> */}

                <div className="card" id="admin-links">
                <h4 className="card-header">Dashboard</h4>
                <ul className="list-group">
                    
                     <li className="list-group-item">
                        <Link exact className="nav-link" to='/user/dashboard'>
                            <AccountBoxIcon style={{ marginRight: '5px' }} />
                            My Profile
                        </Link>
                    </li>

                    <li className="list-group-item">
                        <Link exact className="nav-link" to="/user/see-your-topup-orders">
                            <ListAltIcon style={{ marginRight: '5px' }} />
                            My orders
                        </Link>
                    </li>

                   
                    <li className="list-group-item">
                    <Link exact className="nav-link" to="/user/refill-wallet">
                        <AccountBalanceIcon style={{ marginRight: '5px' }} />
                        My Wallet
                        </Link>
                    </li>
                    
                    <li className="list-group-item">
                        <Link exact className="nav-link" to={`/user/coupons`}>
                        <CardGiftcardIcon style={{ marginRight: '5px' }} />
                            My Coupons
                        </Link>
                    </li>
                </ul>
            </div>
            </Fragment>
            
        );
    };

const Dashboard = () => {
    const [history, setHistory] = useState([]);
     const {user, token} = isAuthenticated();
    const [profile, setProfile] = useState({});
    const [edit , setEdit] = useState(false)
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        postCode: '',
        city: '',
        about:'',
        loading: '',
        error: '',
        updated: '',
        formData: '',
        verified:'',
    });
    const {
        name,
        email,
        phone,
        address,
        postCode,
        city,
        about,
        loading,
        error,
        updated,
        formData,
        verified,
    } = values;

    const init = async () => {
        
        const datas = await getPurchaseHistory(user._id, token)
        const data = await getUserProfile(user, token);
        setHistory(datas);
        setValues({...values, formData: new FormData(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            postCode: data.postCode,
            city: data.city,
            about:data.about,
            verified: data.verified,
        })
            
        
    };

console.log(user);

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const updateProfile = async (event)=>{
        event.preventDefault();

        try{
            setValues({...values, loading: true})
            const newUser = await updateUserProfile(user, token, formData);
            
            if (newUser.error){
                return setValues({...values, error: newUser.error})
            }
            setValues({...values, loading: false, updated: 'Profile'});
            
            
        }catch(err){
            console.log(err);
        }

    }
        const showError = () => (
            <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
                <Typography variant='caption'> 
                    {error}
                </Typography>
            </div>

        );

        const showSuccess = () => (
            <div className="alert alert-info" style={{ display: updated ? '' : 'none' }}>
                <Typography variant='caption'> 
                    {`${updated}`} - successfully updated
                </Typography>
            </div>
        );

    // useEffect(() => {
    //     setTimeout(() => {
    //         window.location.reload()
    //     }, 2000);     
    // }, [updated])

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );
    
    const onChange = () => {
        setEdit(true)
    }

    const userInfo = () => {
        return (

            <>
                <Container className="customSize" style={{border : '1px solid #e6e6e6' , padding : '30px' , borderRadius : '15px'}}>
                <Grid item md={12} sm={12} className='fullWidth'>
                               <div style={{display : 'flex' , justifyContent : 'space-between'}}>
                                    <Typography variant ="subtitle1" >
                                       <span>
                                           <AccountBoxIcon />
                                        </span> User Information
                                    </Typography>


                                    {
                                        edit ? 
                                        <Button 
                                            onClick={updateProfile}
                                            type="submit"
                                            variant= 'contained' 
                                            style={{ backgroundColor : '#f1005f' , color : '#fff', outline: 'none'}}
                                        >
                                            SAVE
                                        </Button>
                                    : 
                                    <Button 
                                        onClick={() => setEdit(true)}
                                        variant= 'contained' 
                                        style={{ backgroundColor : '#f1005f' , color : '#fff', outline: 'none'}}
                                    >
                                        EDIT
                                    </Button>
                                    }
                               </div>

                               <Divider style = {{ margin : '15px 0' }}/>
                            </Grid>
                    <form onSubmit={ updateProfile}>
                        <Grid container item md={12} sm={12} className='fullWidth'>
                            <div>
                                {
                                    edit ? 
                                    <Grid container item md={12}>
                                        <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid item md={2} sm={3} 
                                    style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Username
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            {name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'> 
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Email 
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth' style={{fontSize : '12px'}}>
                                        {email}
                                        <span>
                                            <VerifiedUserIcon style={{marginLeft: '6px', color: '#88e32b', fontSize: '16px'}}/>
                                        </span>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' ,alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Mobile Number
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <Typography variant="subtitle1" style={{fontSize : '12px'}}>
                                            {phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Full Name
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <TextField
                                            fullWidth
                                            id="outlined-basic"
                                            // label="Email"
                                            variant="outlined"
                                            onChange={handleChange('name')} 
                                            type="text" 
                                            value={name} 
                                            style={{margin : '10px 0' , fontSize: '12px', textTransform: 'capitalize'}}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid container item md={12} className='fullWidth'>
                                <Grid item md={4}></Grid>
                                <Grid item md={8} sm={12} className='fullWidth' style={{marginTop: '-12px'}}>
                                    <Typography variant= 'caption' style={{fontSize : '12px', marginLeft: '-17px', color: '#817b90'}}>
                                        Please Enter Your Real Full Name exactly the same as your name on your passport
                                    </Typography>
                                </Grid>
                            </Grid>


                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth'>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'flex-start'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Address
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid container md={8} sm={9} className='fullWidth'>
                                        <Grid md={12} sm={12} className='fullWidth'>
                                            <TextField
                                                fullWidth
                                                id="outlined-basic"
                                                rows = '6'
                                                multiline
                                                variant="outlined"
                                                onChange={handleChange('address')} 
                                                type="text" 
                                                value={address} 
                                                style={{margin : '10px 0' , fontSize: '12px'}}
                                            />
                                        </Grid>
                                        <Grid container md={12} sm={12} spacing={2} className='fullWidth'>
                                            <Grid item md={6} sm={6} className='fullWidth'>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="Country"
                                                    variant="outlined"
                                                    onChange={handleChange('name')} 
                                                    type="text" 
                                                    value={name} 
                                                    style={{margin : '10px 0' , fontSize : '12px'}}
                                                />
                                            </Grid>
                                            <Grid item md={6} sm={6} className='fullWidth'>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="State"
                                                    variant="outlined"
                                                    onChange={handleChange('name')} 
                                                    type="text" 
                                                    value={name} 
                                                    style={{margin : '10px 0', fontSize : '12px'}}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container md={12} sm={12} spacing={2} className='fullWidth'>
                                            <Grid item md={6} sm={6} className='fullWidth'>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="City"
                                                    variant="outlined"
                                                    onChange={handleChange('city')} 
                                                    type="text" 
                                                    value={city} 
                                                    style={{margin : '10px 0', fontSize: '12px'}}
                                                />
                                            </Grid>
                                            <Grid item md={6} sm={6} className='fullWidth'>
                                                <TextField
                                                    fullWidth
                                                    id="outlined-basic"
                                                    label="Post Code"
                                                    variant="outlined"
                                                    onChange={handleChange('postCode')} 
                                                    type="text" 
                                                    value={postCode} 
                                                    style={{margin : '10px 0', fontSize: '12px'}}
                                                />
                                            </Grid>
                                        </Grid>
                                       
                                    </Grid>
                                </Grid>
                            </Grid>
                                    </Grid>
                                    
                                    : 
                                    
                                    
                                    <Grid container item md={12}>

                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid item md={2} sm={3} 
                                    style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Username
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            {name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'> 
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Email
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth' style={{fontSize : '12px'}}>
                                        {email}
                                        <span>
                                            <VerifiedUserIcon style={{marginLeft: '6px',color: '#88e32b' , fontSize: '16px' }}/>
                                        </span>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' ,alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Mobile Number
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <Typography variant="subtitle1" style={{fontSize : '12px'}}>
                                            +88{phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
               
                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Full Name
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid md={8} sm={9} className='fullWidth'>
                                        <Typography variant='subtitle1'
                                         style={{ textTransform : 'capitalize' , fontSize: '12px'}}
                                         >
                                            {name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={1} ></Grid>
                            <Grid item md={11} sm={12} className='fullWidth'>
                                <Grid container item md={12} sm={12} className='fullWidth'>
                                    <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'flex-start'}} className='fullWidth'>
                                        <Typography variant='subtitle1' style={{fontSize : '12px'}}>
                                            Address
                                        </Typography>
                                    </Grid>

                                    <Grid item md={1} ></Grid>
                                    <Grid container md={8} sm={9} className='fullWidth'>
                                   
                                    </Grid>
                                </Grid>
                            </Grid>
                                    </Grid>
                                   
                                }
                            </div>






               
                            
                            
               
                        </Grid>
                    </form>
               
                   
                </Container>
           </>  


        );
    };

    const purchaseHistory = history => {
        return (
            <Container style={{border : '1px solid #e6e6e6' , padding : '30px', marginTop : '20px', borderRadius : '15px'}}>
                <Grid item md={12}>
                    <div>
                        <Typography variant ="subtitle1">
                            <span>
                                <SecurityIcon />
                            </span> Security
                        </Typography>
                    </div>
                    <Divider style = {{ margin : '15px 0' }}/>

                    <Grid container item md={12} sm={12} style={{display : 'flex', justifyContent : 'center', padding: '30px 0'}}>
                    <Link to='/changePassword' style={{textDecoration: 'none' , color : '#00000040'}}>
                        <Card style={{boxShadow: 'none' , border: '1px solid #e5e5e5'}}>
                            <CardContent style={{display : 'flex' , flexDirection : 'column' , alignItems: 'center'}}>
                                <span>
                                    <LockIcon style={{fontSize : '4em' , color : '#bfbfbf'}}/>
                                </span>
                                <Typography variant="subtitle1" style={{color : '#00000040'}}>
                                    Change Password
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                    </Grid>

                   
                </Grid>
            </Container>
            
            // <div className="card mb-5">
            //     <h3 className="card-header">Purchase history</h3>
            //     <ul className="list-group">
            //         <li className="list-group-item">
            //             {history.map((h, i) => {
            //                 return (
            //                     <div>
            //                         <hr />
            //                         {h.products.map((p, i) => {
            //                             return (
            //                                 <div key={i}>
            //                                     <h6>Product name: {p.name}</h6>
            //                                     <h6>
            //                                         Product price: ${p.price}
            //                                     </h6>
            //                                     <h6>
            //                                         Purchased date:{" "}
            //                                         {moment(
            //                                             p.createdAt
            //                                         ).fromNow()}
            //                                     </h6>
            //                                 </div>
            //                             );
            //                         })}
            //                     </div>
            //                 );
            //             })}
            //         </li>
            //     </ul>
            // </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <Hidden smDown>
                <div className="col-md-3"><UserLinks /></div> 
                </Hidden>

                <div className="col-md-9">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
















// import React, { useState, useEffect, Fragment } from "react";
// import Layout from "../core/Layout";
// import { isAuthenticated } from "../auth";
// import { Link } from "react-router-dom";
// import { getPurchaseHistory } from "./apiUser";
// import moment from "moment";
// import { updateUserProfile, getUserProfile } from "./apiUser";
// import './adminDashboard.css'
// import { Button, Container, Divider, Grid, TextField, Typography } from "@material-ui/core";
// import AccountBoxIcon from '@material-ui/icons/AccountBox';
// import SecurityIcon from '@material-ui/icons/Security';
// import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import LockIcon from '@material-ui/icons/Lock';

// export const UserLinks = () => {
//     const {
//         user: { _id }
//     } = isAuthenticated();

//     const toggleMenuView = (event)=>{
//         event.preventDefault();
//         const userMenu = document.getElementById('admin-links')
//         if(userMenu.style.display === ''){
//             return userMenu.style.display = 'block';
//         }
//         if(userMenu.style.display === 'block'){
//             return userMenu.style.display = 'none';
//         }if(userMenu.style.display === 'none'){
//             return userMenu.style.display = 'block';
//         }
//     }
//         return (
//             <Fragment>
//                 <div id="dashboard-menu" className="cursor-pointer" onClick={toggleMenuView}>
//                 <img src="/images/icons/menu.svg" width="23" /> Dashboard Menu
//                 </div>

//                 <div className="card" id="admin-links">
//                 <h4 className="card-header">User Links</h4>
//                 <ul className="list-group">
//                      <li className="list-group-item">
//                         <Link exact className="nav-link" to="/user/see-your-topup-orders">
//                             Your topup orders
//                         </Link>
//                     </li>

//                     <li className="list-group-item">
//                         <Link exact className="nav-link" to="/user/messages">
//                             See messages  <sup className="notifications">0</sup>
//                         </Link>
//                     </li>
//                     <li className="list-group-item">
//                     <Link exact className="nav-link" to="/user/refill-wallet">
//                         Wallet
//                     </Link>
//                     </li>
//                     <li className="list-group-item">
//                         <Link exact className="nav-link" to="/cart">
//                             My Cart
//                         </Link>
//                     </li>
//                     <li className="list-group-item">
//                         <Link exact className="nav-link" to={`/user/coupons`}>
//                             Diamonds Coupons
//                         </Link>
//                     </li>
                    
                    
//                 </ul>
//             </div>
//             </Fragment>
            
//         );
//     };

// const Dashboard = () => {
//     const [history, setHistory] = useState([]);
//      const {user, token} = isAuthenticated();
//     const [profile, setProfile] = useState({});
//     const [edit , setEdit] = useState(false)
//     const [values, setValues] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         address: '',
//         postCode: '',
//         city: '',
//         about:'',
//         loading: '',
//         error: '',
//         updated: '',
//         formData: '',
//         verified:'',
//     });
//     const {
//         name,
//         email,
//         phone,
//         address,
//         postCode,
//         city,
//         about,
//         loading,
//         error,
//         updated,
//         formData,
//         verified,
//     } = values;

//     const init = async () => {
        
//         const datas = await getPurchaseHistory(user._id, token)
//         const data = await getUserProfile(user, token);
//         setHistory(datas);
//         setValues({...values, formData: new FormData(),
//             name: data.name,
//             email: data.email,
//             phone: data.phone,
//             address: data.address,
//             postCode: data.postCode,
//             city: data.city,
//             about:data.about,
//             verified: data.verified,
//         })
            
        
//     };

// console.log(user);

//     useEffect(() => {
//         init();
//     }, []);

//     const handleChange = name => event => {
//         const value = name === 'photo' ? event.target.files[0] : event.target.value;
//         formData.set(name, value);
//         setValues({ ...values, [name]: value });
//     };

//     const updateProfile = async (event)=>{
//         event.preventDefault();

//         try{
//             setValues({...values, loading: true})
//             const newUser = await updateUserProfile(user, token, formData);
            
//             if (newUser.error){
//                 return setValues({...values, error: newUser.error})
//             }
//             setValues({...values, loading: false, updated: 'Profile'});
            
            
//         }catch(err){
//             console.log(err);
//         }

//     }
//         const showError = () => (
//             <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
//                 <Typography variant='caption'> 
//                     {error}
//                 </Typography>
//             </div>

//         );

//         const showSuccess = () => (
//             <div className="alert alert-info" style={{ display: updated ? '' : 'none' }}>
//                 <Typography variant='caption'> 
//                     {`${updated}`} - successfully updated
//                 </Typography>
//             </div>
//         );

//     // useEffect(() => {
//     //     setTimeout(() => {
//     //         window.location.reload()
//     //     }, 2000);     
//     // }, [updated])

//     const showLoading = () =>
//         loading && (
//             <div className="alert alert-success">
//                 <h2>Loading...</h2>
//             </div>
//         );
    
//     const onChange = () => {
//         setEdit(true)
//     }

//     const userInfo = () => {
//         return (

//             <>
//                 <Container className="customSize" style={{border : '1px solid #e6e6e6' , padding : '30px' , borderRadius : '15px'}}>
//                 <Grid item md={12} sm={12} className='fullWidth'>
//                                <div style={{display : 'flex' , justifyContent : 'space-between'}}>
//                                     <Typography variant ="subtitle1" >
//                                        <span>
//                                            <AccountBoxIcon />
//                                         </span> User Information
//                                     </Typography>


//                                     {
//                                         edit ? 
//                                         <Button 
//                                             onClick={updateProfile}
//                                             type="submit"
//                                             variant= 'contained' 
//                                             style={{ backgroundColor : '#f1005f' , color : '#fff', outline: 'none'}}
//                                         >
//                                             SAVE
//                                         </Button>
//                                     : 
//                                     <Button 
//                                         onClick={() => setEdit(true)}
//                                         variant= 'contained' 
//                                         style={{ backgroundColor : '#f1005f' , color : '#fff', outline: 'none'}}
//                                     >
//                                         EDIT
//                                     </Button>
//                                     }
//                                </div>

//                                <Divider style = {{ margin : '15px 0' }}/>
//                             </Grid>
//                     <form onSubmit={ updateProfile}>
//                         <Grid container item md={12} sm={12} className='fullWidth'>
//                             <div>
//                                 {
//                                     edit ? 
//                                     <Grid container item md={12}>
//                                         <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid item md={2} sm={3} 
//                                     style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Username
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             {name}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'> 
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Email 
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth' style={{fontSize : '12px'}}>
//                                         {email}
//                                         <span>
//                                             <VerifiedUserIcon style={{marginLeft: '6px', color: '#88e32b', fontSize: '16px'}}/>
//                                         </span>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' ,alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Mobile Number
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <Typography variant="subtitle1" style={{fontSize : '12px'}}>
//                                             {phone}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Full Name
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <TextField
//                                             fullWidth
//                                             id="outlined-basic"
//                                             // label="Email"
//                                             variant="outlined"
//                                             onChange={handleChange('name')} 
//                                             type="text" 
//                                             value={name} 
//                                             style={{margin : '10px 0' , fontSize: '12px', textTransform: 'capitalize'}}
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid container item md={12} className='fullWidth'>
//                                 <Grid item md={4}></Grid>
//                                 <Grid item md={8} sm={12} className='fullWidth' style={{marginTop: '-12px'}}>
//                                     <Typography variant= 'caption' style={{fontSize : '12px', marginLeft: '-17px', color: '#817b90'}}>
//                                         Please Enter Your Real Full Name exactly the same as your name on your passport
//                                     </Typography>
//                                 </Grid>
//                             </Grid>


//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth'>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'flex-start'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Address
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid container md={8} sm={9} className='fullWidth'>
//                                         <Grid md={12} sm={12} className='fullWidth'>
//                                             <TextField
//                                                 fullWidth
//                                                 id="outlined-basic"
//                                                 rows = '6'
//                                                 multiline
//                                                 variant="outlined"
//                                                 onChange={handleChange('address')} 
//                                                 type="text" 
//                                                 value={address} 
//                                                 style={{margin : '10px 0' , fontSize: '12px'}}
//                                             />
//                                         </Grid>
//                                         <Grid container md={12} sm={12} spacing={2} className='fullWidth'>
//                                             <Grid item md={6} sm={6} className='fullWidth'>
//                                                 <TextField
//                                                     fullWidth
//                                                     id="outlined-basic"
//                                                     label="Country"
//                                                     variant="outlined"
//                                                     onChange={handleChange('name')} 
//                                                     type="text" 
//                                                     value={name} 
//                                                     style={{margin : '10px 0' , fontSize : '12px'}}
//                                                 />
//                                             </Grid>
//                                             <Grid item md={6} sm={6} className='fullWidth'>
//                                                 <TextField
//                                                     fullWidth
//                                                     id="outlined-basic"
//                                                     label="State"
//                                                     variant="outlined"
//                                                     onChange={handleChange('name')} 
//                                                     type="text" 
//                                                     value={name} 
//                                                     style={{margin : '10px 0', fontSize : '12px'}}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                         <Grid container md={12} sm={12} spacing={2} className='fullWidth'>
//                                             <Grid item md={6} sm={6} className='fullWidth'>
//                                                 <TextField
//                                                     fullWidth
//                                                     id="outlined-basic"
//                                                     label="City"
//                                                     variant="outlined"
//                                                     onChange={handleChange('city')} 
//                                                     type="text" 
//                                                     value={city} 
//                                                     style={{margin : '10px 0', fontSize: '12px'}}
//                                                 />
//                                             </Grid>
//                                             <Grid item md={6} sm={6} className='fullWidth'>
//                                                 <TextField
//                                                     fullWidth
//                                                     id="outlined-basic"
//                                                     label="Post Code"
//                                                     variant="outlined"
//                                                     onChange={handleChange('postCode')} 
//                                                     type="text" 
//                                                     value={postCode} 
//                                                     style={{margin : '10px 0', fontSize: '12px'}}
//                                                 />
//                                             </Grid>
//                                         </Grid>
                                       
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                                     </Grid>
                                    
//                                     : 
                                    
                                    
//                                     <Grid container item md={12}>

//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid item md={2} sm={3} 
//                                     style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Username
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             {name}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'> 
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Email
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth' style={{fontSize : '12px'}}>
//                                         {email}
//                                         <span>
//                                             <VerifiedUserIcon style={{marginLeft: '6px',color: '#88e32b' , fontSize: '16px' }}/>
//                                         </span>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' ,alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Mobile Number
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <Typography variant="subtitle1" style={{fontSize : '12px'}}>
//                                             +88{phone}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
               
//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth' style={{margin:"10px 0"}}>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'center'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Full Name
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid md={8} sm={9} className='fullWidth'>
//                                         <Typography variant='subtitle1'
//                                          style={{ textTransform : 'capitalize' , fontSize: '12px'}}
//                                          >
//                                             {name}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>

//                             <Grid item md={1} ></Grid>
//                             <Grid item md={11} sm={12} className='fullWidth'>
//                                 <Grid container item md={12} sm={12} className='fullWidth'>
//                                     <Grid md={2} sm={3} style={{display : 'flex' , alignItems : 'flex-start'}} className='fullWidth'>
//                                         <Typography variant='subtitle1' style={{fontSize : '12px'}}>
//                                             Address
//                                         </Typography>
//                                     </Grid>

//                                     <Grid item md={1} ></Grid>
//                                     <Grid container md={8} sm={9} className='fullWidth'>
                                   
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                                     </Grid>
                                   
//                                 }
//                             </div>






               
                            
                            
               
//                         </Grid>
//                     </form>
               
                   
//                 </Container>
//            </>  


//         );
//     };

//     const purchaseHistory = history => {
//         return (
//             <Container style={{border : '1px solid #e6e6e6' , padding : '30px', marginTop : '20px', borderRadius : '15px'}}>
//                 <Grid item md={12}>
//                     <div>
//                         <Typography variant ="subtitle1">
//                             <span>
//                                 <SecurityIcon />
//                             </span> Security
//                         </Typography>
//                     </div>
//                     <Divider style = {{ margin : '15px 0' }}/>

//                     <Grid container item md={12} sm={12} style={{display : 'flex', justifyContent : 'center', padding: '30px 0'}}>
//                     <Link to='/changePassword' style={{textDecoration: 'none' , color : '#00000040'}}>
//                         <Card style={{boxShadow: 'none' , border: '1px solid #e5e5e5'}}>
//                             <CardContent style={{display : 'flex' , flexDirection : 'column' , alignItems: 'center'}}>
//                                 <span>
//                                     <LockIcon style={{fontSize : '4em' , color : '#bfbfbf'}}/>
//                                 </span>
//                                 <Typography variant="subtitle1" style={{color : '#00000040'}}>
//                                     Change Password
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Link>
//                     </Grid>

                   
//                 </Grid>
//             </Container>
            
//             // <div className="card mb-5">
//             //     <h3 className="card-header">Purchase history</h3>
//             //     <ul className="list-group">
//             //         <li className="list-group-item">
//             //             {history.map((h, i) => {
//             //                 return (
//             //                     <div>
//             //                         <hr />
//             //                         {h.products.map((p, i) => {
//             //                             return (
//             //                                 <div key={i}>
//             //                                     <h6>Product name: {p.name}</h6>
//             //                                     <h6>
//             //                                         Product price: ${p.price}
//             //                                     </h6>
//             //                                     <h6>
//             //                                         Purchased date:{" "}
//             //                                         {moment(
//             //                                             p.createdAt
//             //                                         ).fromNow()}
//             //                                     </h6>
//             //                                 </div>
//             //                             );
//             //                         })}
//             //                     </div>
//             //                 );
//             //             })}
//             //         </li>
//             //     </ul>
//             // </div>
//         );
//     };

//     return (
//         <Layout
//             title="Dashboard"
//             description={`G'day ${name}!`}
//             className="container-fluid"
//         >
//             <div className="row">
//                 <div className="col-md-3"><UserLinks /></div>
//                 <div className="col-md-9">
//                     {showLoading()}
//                     {showSuccess()}
//                     {showError()}
//                     {userInfo()}
//                     {purchaseHistory(history)}
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default Dashboard;






