'use client'
import { ChangeEvent, useState } from "react"

type Props = {
    placeholder: string,
    value: string,
    onValueChange: (val: string) => void
}

const PasswordField = (props: Props) => {
    const [visible, setVisible] = useState(false)
    const [password, setPassword] = useState('')

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    return (
        <div className="password-field-container">
            <input className="password-field" type={visible ? "text" : "password"} placeholder={props.placeholder}  value={props.value} onChange={(e) => {props.onValueChange(e.target.value)}}/>
            <span onClick={toggleVisibility} className="icon-container">
                <img className="icon" src={visible ? '/assets/icons/eye-icon.svg' : '/assets/icons/eye-slash-icon.svg'}/>
            </span>
        </div>
    )
}

export default PasswordField