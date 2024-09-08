import React, { useState } from 'react'
import "./loginPage.css";
import { authService, CredentialsOrNull } from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthProvider';
import { UserConnectOrNull } from '../../../models/user.model';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const navigate = useNavigate();
    const [showGoogleLogin, setShowGoogleLogin] = useState(false);
    const [serverError, setServerError] = React.useState<string | null>(null); // Ajoutez un état pour les erreurs du serveur

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const authProvider = useAuth();
    const handleConnexion = (credentials: CredentialsOrNull) => {
        console.log(credentials);
        authService.login(credentials)
            .then(res => {
                console.log(res.status);
                console.log(res.data.token);
                
                authService.saveToken(res.data.token); // Sauvegarde du token
                console.log(authService.getTokenInfo());
                authProvider.setUser(authService.getTokenInfo() as UserConnectOrNull);
                console.log(authProvider.user);
                
                navigate('/task', { replace: true });
            })
            .catch(error => {
                const message = error.response?.data?.message || 'Erreur lors de la connexion';
                setServerError(message);
            });
    };

    const handleGmailClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setShowGoogleLogin(true);
    };
    

  return (
    <>
   <div className="max-w-sm mx-auto mt-12 p-6 bg-white border border-gray-500 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    
        <form className="max-w-sm mx-auto p-4"onSubmit={handleSubmit((data) => handleConnexion(data as CredentialsOrNull))} >
            <div className="flex">
                <svg className="w-6 h-6 text-red-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.737 8.737a21.49 21.49 0 0 1 3.308-2.724m0 0c3.063-2.026 5.99-2.641 7.331-1.3 1.827 1.828.026 6.591-4.023 10.64-4.049 4.049-8.812 5.85-10.64 4.023-1.33-1.33-.736-4.218 1.249-7.253m6.083-6.11c-3.063-2.026-5.99-2.641-7.331-1.3-1.827 1.828-.026 6.591 4.023 10.64m3.308-9.34a21.497 21.497 0 0 1 3.308 2.724m2.775 3.386c1.985 3.035 2.579 5.923 1.248 7.253-1.336 1.337-4.245.732-7.295-1.275M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                </svg>
                <h5 className='font-semibold'>DevChallenges</h5>
            </div>
           
                <div className="mt-6">
                    <label htmlFor="email" className="block font-semibold mb-2 text-2xl text-gray-900 dark:text-white">Login</label>
                {serverError && <div className="w-full error text-sm text-red-800">{serverError}</div>}
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"/>
                        <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"/>
                        </svg>

                        </div>
                        <input type="text" id="email" {...register('username', { required: true })} 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-300 focus:border-red-300 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Email or name" />
                    </div>
                        {errors?.username && <div className="error text-sm text-red-800">Le login est obligatoire</div>}
                </div>
                <div className="mt-6">
                    <div className="relative">
                       <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
                        </svg>
                        </div>
                        <input type="password" id="password" {...register('password', { required: true })}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-300 focus:border-red-300 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="••••••••" />
                    </div>
                        {errors?.password && <div className="error text-sm text-red-800">Mot de passe obligatoire</div>}
                </div>
               
                <div className="mt-4">
                    <button type="submit" className="w-full flex justify-center items-center btn text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><span className='pr-4'>Login</span> 
                        <svg className="w-6 h-6 text-White dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
                        </svg>
                    </button>
                </div>
               
            <div className="flex items-center justify-center mt-5 flex-wrap">
                
                    {showGoogleLogin && (
                        <div className='p-2'>
                        {showGoogleLogin && <GoogleLogin
                        onSuccess={credentialResponse => {
                            const token = credentialResponse.credential || '';
                            const decodedToken = authService.getTokenInfoOther(token);
                            console.log(decodedToken);
                            const email = decodedToken.email;
                            if (email) {
                                const newCredentials: CredentialsOrNull = {
                                    username: email,
                                    password: 'passer133',
                                };

                                handleConnexion(newCredentials);
                            } else {
                                setServerError('Google login failed');
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        shape='rectangular'
                    />}
                        </div>
                    )}
                <label htmlFor="terms" className="ms-2 text-sm font-medium text-gray-600 dark:text-gray-300">Or continue with there social Profile</label>
                <div className=' mt-5 w-full flex justify-around'>
                    <div onClick={handleGmailClick} className='gmail w-10 h-10 border border-gray-200 rounded-full shadow flex items-center justify-center '>
                       
                        <a href="" id='auth Gmail'>
                            <svg className="w-5 h-5 text-red-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            
                            <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                    <div className='w-10 h-10 border border-gray-200 rounded-full shadow flex items-center justify-center'>
                        <a href="#">
                            <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
                            </svg>

                        </a>
                    </div>
                    <div className='w-10 h-10 border border-gray-200 rounded-full shadow flex items-center justify-center'>
                        <a href="#">
                            <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                    <div className='w-10 h-10 border border-gray-200 rounded-full shadow flex items-center justify-center'>
                        <a href="#">
                            <svg className="w-5 h-5 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <label htmlFor="terms" className="ms-2 mt-5 text-sm font-medium text-gray-600 dark:text-gray-300">Don't have an account yet? <a href="#" className="text-red-600 hover:underline dark:text-red-500">Register</a></label>
            </div>
           
        </form>

   </div>
        <div className='max-w-sm mx-auto mt-2 flex justify-between'>
            <div>
            <label htmlFor="terms" className="ms-2 text-xs mt-5 text-gray-500 dark:text-gray-300">Created bye <a href="#" className="underline font-bold text-xs text-gray-500 hover:underline dark:text-gray-500">Mansour</a></label>
            </div>
            <div>
            <label htmlFor="terms" className="ms-2 text-xs mt-5 text-gray-500 dark:text-gray-300">DevChallenge.io</label>
            </div>
        </div>
    </>
  )
}
