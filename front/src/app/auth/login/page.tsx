'use client'
import './page.css'
import PasswordField from "@/components/PasswordField"
import { FormEvent, useState } from "react"
import { loginOnApi } from "@/lib/api"
import { useRouter } from "next/navigation"


const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await loginOnApi({ email, password })
            router.push('/admin')
        } catch (err: any) {
            setError(err.message || 'Ошибка входа')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        
            <img className='f-b-1' src='/assets/icons/f-e-2.svg' />
            <div className="main-container">
                <header className="header">
                    <div className="header__dagcode-logo">
                        <img src='/assets/icons/dagcode-icon-text.svg' />
                    </div>
                </header>

                <section className="login-container">
                    <h1 className="login__heading">Вход в систему</h1>
                    {error && <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}
                    <form className="login__form" onSubmit={handleSubmit}>
                        <div className='login__field-container'>
                            <input placeholder="E-mail" className="login__field" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                            <PasswordField placeholder="Пароль" value={password} onValueChange={setPassword}/>
                        </div>
                        <div className="login__buttons-container">
                            <button className="login__login-button" disabled={isLoading}>{isLoading ? 'Вход...' : 'Войти'}</button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}

export default LoginPage