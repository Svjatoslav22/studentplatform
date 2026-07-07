import {Button} from '@material-ui/core'
import React from 'react'
import Navbar from '../NavBar/Navbar'
import SocialMedia from '../SocialMedia/SocialMedia'

const Welcome = () => (
    <div className="WelcomePage">
        <Navbar isLoggedIn={false} />
        <div className="WelcomePage__Body">
            <h1 className="WelcomePage__Body__Title">
                <span>Студентський</span>
                <span>Форум</span>
            </h1>
            <div className="WelcomePage__Body__Description">
                <p className="WelcomePage__Body__Description__Text">
                    Ласкаво просимо на платформу для студентів — місце для обміну
                    розкладом, навчальними матеріалами та співпраці над проєктами.
                </p>

                <Button className="WelcomePage__Body__Description__Button" onClick={() => window.open('/home', '_self')}>
                    Дізнатись більше
                </Button>
            </div>
            <SocialMedia />
        </div>
    </div>
)

export default Welcome
