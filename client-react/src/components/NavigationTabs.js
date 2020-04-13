import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tableau from "./Tableau";
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import CasePerYearGraph from "./graphs/HorizontalStackedBar/CasParAn";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}
function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={event => {
                event.preventDefault();
            }}
            {...props} />
    );
}
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));
const NavigationTabs = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [allCas, setAllCas] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);
    const [order, setOrder] = React.useState(0);
    const [totalCas, setTotalCas] = React.useState(0);
    const [nameFilter, setNameFilter] = React.useState('');
    const [resumeFilter, setResumeFilter] = React.useState('');
    const [zoneFilter, setZoneFilter] = React.useState('');
    const [classificationFilter, setClassificationFilter] = React.useState([]);

    const [dataGrapheCasParAn, setDataGrapheCasParAn] = React.useState([]);

    const handleChangeTab = (event, newValue) => { setValue(newValue) };
    const handleChangeOrder = () => { order === 1 ? setOrder(-1) : setOrder(1); setPage(0) };
    const handleChangePage = (page) => { setPage(page) };
    const handleChangeRowsPerPage = (rowPerPage) => { setPage(0); setPageSize(rowPerPage) };
    const asyncHandle = (id, value) => {
        switch (id) {
            case 'name':
                setNameFilter(value);
                setPage(0);
                break;
            case 'resume':
                setResumeFilter(value);
                setPage(0);
                break;
            case 'zone':
                setZoneFilter(value);
                setPage(0);
                break;
            case 'classification':
                setClassificationFilter(value);
                setPage(0);
                break;
            default:
        }
    };
    const asyncHandleFilter = AwesomeDebouncePromise(
        asyncHandle,
        750,
        { key: (id, text) => id },
    );
    useEffect(() => {
        getDataFromServer();
        getDataGrapheCasParAn();
    }, [page, pageSize, order, nameFilter, resumeFilter, zoneFilter, classificationFilter]);
    const getDataFromServer = () => {
        // check filters
        let filter = '';
        if (nameFilter) {
            filter += "name=" + nameFilter + "&";
        }
        if (resumeFilter) filter += "resume=" + resumeFilter + "&";
        if (zoneFilter) filter += "zone=" + zoneFilter + "&";
        if (classificationFilter.length) {
            filter += "classification=";
            filter += classificationFilter;
        }
        if (filter) {
            if (filter.endsWith('&')) {
                filter = filter.substring(0, filter.length - 1);
            }
        }
        let url = 'http://localhost:8080/api/v1/cas?page=' + page + '&pagesize=' + pageSize + '&order=' + order + (filter ? '&' + filter : '');
        fetch(url)
            .then(response => {
                return response.json(); // transforme le json texte en objet js
            })
            .then(res => { // res c'est le texte json de response ci-dessus
                setAllCas(res.data);
                setTotalCas(res.count);
            })
            .catch(err => {
                console.log("erreur dans le get : " + err)
            });
    };

    const getDataGrapheCasParAn = () => {
        let url = 'http://localhost:8080/api/v1/graphe/cas_par_an';
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(res => {
                setDataGrapheCasParAn(res);
            })
            .catch(err => {
                console.log("erreur dans le get data graph 1: " + err)
            });
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChangeTab}
                    aria-label="Navigation tabs">
                    <LinkTab label="Tous les cas" />
                    <LinkTab label="Statistiques" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Tableau data={allCas}
                    totalCas={totalCas}
                    page={page}
                    rowsPerPage={pageSize}
                    order={order}
                    handlerChangeOrder={handleChangeOrder}
                    handlerChangePage={handleChangePage}
                    handlerChangeRowsPerPage={handleChangeRowsPerPage}
                    asyncHandleChangeNameFilter={asyncHandleFilter} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <h2>Librairie utilisée</h2>
                <a title="Nivo" href="https://nivo.rocks" target="_blank">nivo</a>

                <div style={{height: 1000}}>
                    <CasePerYearGraph style={{flex: 1}} data={dataGrapheCasParAn}/>
                    <div style={{flex: 1, marginBottom: "70px", textAlign: "justify"}}>
                        <h4>Interprétation</h4>
                        <p style={{marginLeft: "40px", marginRight: "40px"}}>
                            Sur ce graphe, on peut voir que le nombre de cas recensé diffère grandement selon les années.
                            De l'année 1937 à 1954, assez peu de cas sont recensés avec néanmoins un petit pic en 1954 avec 21 cas,
                            dont un assez inquiétant regroupant entre 6 et 10 témoignages.
                            <br/>
                            A partir de l'année 1976 on peut voir une montée significative du nombre d'observations qui durera jusqu'en 2018.
                            Certaines années, tels que 1983, 1988 ou 1991 ont vu 2 cas ou plus rassemblant + de 10 témoignages, donc des cas assez louches !!
                            <br/>
                            A noter la période 2007-2016 avec énormément de recensement d'observation de phénoménes étranges ...
                        </p>
                        <br/>
                        <h4>Conclusion</h4>
                        <p style={{marginLeft: "40px", marginRight: "40px"}}>
                            On peut supposer que jusqu'à 1976, les observations n'ont peut-être pas toutes été enregistrés...
                            Aussi, de 1976 à 2007, avec l'avénement d'internet et des nouvelles technos, on peut imaginer que "des erreurs de jugement
                            ont été commises".
                            <br/>
                            Autant pour l'avant 2008 on peut douter, mais pour la période 2007-2016... Nul doute, nous avons été visité! Peut-être, ces êtres
                            intelligents seraient amateur de smartphone Apple (Premier iPhone "EDGE" le 29 juin 2007 et iPhone "3G" en 2008),
                            resteraient dans les environs dans l'attente du dernier modèle et donc feraient des erreurs menant à cette augmentation nette
                            des observations...
                            <br/>
                            <br/>
                            Pour nous c'est sur : Nous avons été visité par des extra-terrestres amateur de produits Apple...
                        </p>
                    </div>
                </div>
            </TabPanel>
        </div>
    );
};
export default NavigationTabs;