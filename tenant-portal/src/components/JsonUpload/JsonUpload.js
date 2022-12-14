import uploadTheme from "../../assets/img/upload-theme.png"
import uploadIcon from "../../assets/img/upload-icon.svg"
import {useTranslation} from "react-i18next";
import GenericButton from "../GenericButton/GenericButton";
import styles from './JsonUpload.module.css';
import CopyIcon from "../../assets/img/copy.svg";
import DownloadIcon from "../../assets/img/download.svg";
import {useState} from "react";
import {useKeycloak} from '@react-keycloak/web'
import config from '../../config.json';
const axios = require('axios');

function JsonUpload() {

    const { t } = useTranslation();
    const {keycloak} = useKeycloak();

    const [fileUploaded, setFileUploaded] = useState(false);
    const [file, setFile] = useState(null);
    const [schema, setSchema] = useState("");
    const [schemaUploadStatus, setSchemaUploadStatus] = useState("");
    const getUserId = async () => {    
        const userInfo = await keycloak.loadUserInfo();
        return userInfo.email;
    }
    const getToken = async () => {
        const userId = await getUserId();
        return axios.get(`${config.tokenEndPoint}/${userId}`).then(res =>
        res.data.access_token.access_token
    ).catch(error => {
        console.error(error);
        throw error;
    });
    };
    const  addschemaFunc = async () => {
        const userToken = await getToken();
        console.log(userToken);
        return axios.post(`/vc-management/v1/schema`,schema,
        {headers:{Authorization :userToken}}).then(res =>
            res.data
        ).catch(error => {
            console.error(error);
            throw error;
        });
    }
    const handleSaveJson = async () => {
        if(!fileUploaded) {
            alert('please upload file and proceed')
        } else {
            const reader = new FileReader()
            reader.readAsText(file);
            reader.onload = () =>{
                setSchema(reader.result)
                alert(schema)
            }
            const result = await addschemaFunc();
            console.log(result);
        }
    }
    const handleFileUpload = (e) => {
        console.log(e.target.files)
        if (e.target.files.length > 0) {
            setFileUploaded(true);
            setFile(e.target.files[0])
        } else {
            setFileUploaded(false);
            setFile(null)
        }
    }
    return (
        <div>
        <div className="d-flex justify-content-between align-items-center flex-column flex-md-row my-3 offset-1 offset-md-2 offset-xxl-3 col-10 col-md-9 col-7">
            <div className={`col-12 col-md-7 me-md-3 ${styles['upload-container']}`}>
                <p className="title">{t('jsonSchemaUpload.title')}</p>
                <div className="border rounded-2 p-3 text-center mb-3 position-relative" style={{cursor:'pointer'}}>
                    <div className="d-flex align-items-stretch h-100">
                        <input type="file" className="w-100 position-absolute top-0 start-0 h-100 opacity-1" onChange={handleFileUpload}/>
                    </div>
                    {
                        fileUploaded && <div className="d-flex justify-content-center align-items-center">
                            <img src={uploadIcon} alt="upload icon" className="me-3"/>
                            <span>{file.name}</span>
                        </div>
                    }
                    {!fileUploaded && <div>
                        <img src={uploadIcon} alt="upload icon" className="mb-3"/>
                        <p className={styles['upload-help-text']}>{t('jsonSchemaUpload.uploadComment1')}</p>
                        <p className={styles['upload-help-text']}>{t('jsonSchemaUpload.or')}</p>
                        <p className={styles['upload-instruction']}>{t('jsonSchemaUpload.uploadComment2')}</p>
                    </div>}
                </div>
                <div className="d-flex justify-content-between align-items-center flex-column flex-md-row">
                    <div className='container-fluid my-3 px-0'>
                        <div className='px-0 mx-0 d-flex flex-wrap'>
                            <div className='col-12 col-lg-6 my-2 pe-0 pe-lg-2' onClick={handleSaveJson}>
                                <GenericButton img='' text={t('jsonSchemaUpload.draftButtonText')} type='button' variant='secondary' />
                            </div>
                            <div className='col-12 col-lg-6 my-2 ps-0 ps-lg-2' onClick={async()=>  {await handleSaveJson()}}>
                                <GenericButton img='' text={t('jsonSchemaUpload.saveButtonText')} type='button' variant='primary' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-5 text-center">
                <img src={uploadTheme} className="mw-100" alt="upload theme img"/>
            </div>
        </div>
        </div>
    )
}

export default JsonUpload;