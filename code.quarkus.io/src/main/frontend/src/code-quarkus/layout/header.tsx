import React from 'react';
import './header.scss';
import { AngleLeftIcon } from '@patternfly/react-icons';
import { createLinkTracker, useAnalytics } from '../../core/analytics';

export function Header(props: { quarkusVersion: string }) {
    const analytics = useAnalytics();
    const linkClick = (e: any) => {
        const link = e.target.getAttribute('href');
        analytics.event('UX', 'Click on header link', link);
    };
    const linkTracker = createLinkTracker(analytics,'UX', 'Header');
    const isCodeQuarkusReferrer = document.referrer.includes("code.quarkus.io");
    return (
        <div className="header">
            <div className="header-content responsive-container">
                <div className="redhat-brand">
                    <a href="https://www.redhat.com" className="pf-c-nav__link" onClick={linkClick}>
                        <img className="logo" alt="Red Hat Logo"
                             src="/static/media/rh-logo.svg"/>
                    </a>
                </div>
                {isCodeQuarkusReferrer && (
                    <div className="nav-container">
                        <a href="https://code.quarkus.io" onClick={linkTracker}><AngleLeftIcon/> Back to code.quarkus.io</a>
                    </div>
                )}
                <div className="quarkus-brand">
                    <a href="https://quarkus.io" onClick={linkTracker}>
                        <img src="/static/media/quarkus-logo.svg" className="logo" title="Quarkus" alt="Quarkus"/>
                    </a>
                    <div className="quarkus-version">
                        <span>{props.quarkusVersion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}