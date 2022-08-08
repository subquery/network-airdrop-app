import { VFC } from "react";
import { useTranslation } from "react-i18next";

import styles from './Contact.module.css';

export const Contact: VFC = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <span className={styles.text}>{t(`support.contact`)}</span>
        </div>
    ) 
} 
