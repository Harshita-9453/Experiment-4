import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/signup', formData);
            alert(res.data.msg);
        } catch (err) {
            console.error(err.response.data);
            alert('Error during signup.');
        }
    };

    return (
        <form onSubmit={onSubmit} className='login'>
            <h1>Sign Up</h1>
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
