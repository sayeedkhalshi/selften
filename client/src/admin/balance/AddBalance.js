import React, { useState, useEffect } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { Link } from 'react-router-dom';
import { addBalance, showBalance } from './../apiAdmin';

const AddBalance = () => {
    const [values, setValues] = useState({
        balance: '',
        oldBalance: '',
        loading: false,
        error: '',
        createdBalance: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        balance,
        oldBalance,
        loading,
        error,
        createdBalance,
        redirectToProfile,
        formData
    } = values;

    // load categories and set form data
    const init = () => {
        showBalance().then(data => {
            if(typeof data === 'undefined'){
                setValues({
                    ...values,
                    oldBalance: 0,
                    formData: new FormData()
                });
            }else{
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    oldBalance: data[0].balance,
                    formData: new FormData()
                });
            }
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        addBalance(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    oldBalance: oldBalance + balance,
                    balance: '',
                    loading: false,
                    createdBalance: 'Balance'
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Balance Stock in BDT: {oldBalance} </h4>

            <div className="form-group">
                <label className="text-muted">Add more balance or subtract by putting - before</label>
                <input onChange={handleChange('balance')} type="text" className="form-control" value={balance} />
            </div>

            <button className="btn btn-outline-primary">Add Balance</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdBalance ? '' : 'none' }}>
            <h2>{`${createdBalance}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add a new product" description={`G'day ${user.name}, ready to add a new product?`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddBalance;