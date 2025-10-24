import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authActions';
import { AppDispatch, RootState } from '../redux/store';
import {
  containerClass,
  formClass,
  inputClass,
  buttonClass,
  errorClass,
  labelClass,
} from '../utils/style';
import { useForm } from 'react-hook-form';
import { User } from '../Models/User';
import { Slide, toast } from 'react-toastify';

export function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn, error, status } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (userData: any) => {
    dispatch(login(userData));
  };

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-4">התחברות</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
        <div className={labelClass}>
          <label>אימייל</label>
          <input
            type="email"
            className={inputClass}
            {...register('email', { required: 'נא למלא אימייל' })}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div className={labelClass}>
          <label>סיסמה</label>
          <input
            type="password"
            className={inputClass}
            {...register('password', { required: 'נא למלא סיסמה' })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'מתחבר...' : 'התחבר'}
        </button>
        {error && <p className={errorClass}>{error}</p>}
      </form>
    </div>
  );
}
