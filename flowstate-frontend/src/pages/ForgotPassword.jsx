
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { forgotPassword } from '../services/api';
import AuthLayout from '../components/AuthLayout';

function ForgotPassword(){

const[Data,setData] = useState({email:''});
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const handleChange =(e) =>{
    setData({...Data , [e.target.name]:e.target.value})
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await forgotPassword(Data) ;
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    }
  };
return(
<AuthLayout>
<div style={{textAlign : 'center', marginTop: '12px'}}>
<form onSubmit={handleSubmit}>
<div style={{marginTop: '16px'}}>
<Input type="email" name ="email" placeholder ="Email" onChange ={handleChange}></Input>
</div>
<div style={{marginTop: '16px'}}>
<Button variant="filled" width="100%" type="submit" style={{marginTop: '16px'}}>
 envoyé le mail de validation</Button>
 </div>
</form>
{error && <p style={{color: 'red'}}>{error}</p>}
{success && <p style={{color: 'green'}}>Email envoyé ! Vérifie ta boîte mail.</p>}
</div>
</AuthLayout>
);


}
export default ForgotPassword ;