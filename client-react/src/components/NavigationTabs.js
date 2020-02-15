import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tableau from "./Tableau";

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
    const [cas, setCas] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(5);
    const [order, setOrder] = React.useState(0);
    const [totalCas, setTotalCas] = React.useState(0);

    const handleChangeTab = (newValue) => { setValue(newValue) };

    const handlerChangeOrder = (order) => { setOrder(order) };

    const handlerChangePage = (page) => { setPage(page) };

    const handlerChangeRowsPerPage = (rowPerPage) => { setPage(0); setPageSize(rowPerPage) };

    useEffect(() => {
        getDataFromServer();
    }, [page, pageSize, order]);

    const getDataFromServer = () => {
        fetch('http://localhost:8080/api/v1/cas?page=' + page + '&pagesize=' + pageSize + '&order=' + order)
            .then(response => {
                return response.json(); // transforme le json texte en objet js
            })
            .then(res => { // res c'est le texte json de response ci-dessus
                setCas(function(oldCas) {
                    const newCas = res.data;
                    return newCas;
                });
                setTotalCas(function(oldTotalCas) {
                    const newTotalCas = res.count;
                    return newTotalCas;
                });
            })
            .catch(err => {
                console.log("erreur dans le get : " + err)
            });
    };

    return (
        <div className={classes.root}>
            <AppBar position="sticky">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChangeTab}
                    aria-label="Navigation tabs">
                    <LinkTab label="Tous les cas" />
                    <LinkTab label="Statistiques" />
                    <LinkTab label="To do" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Tableau data={cas}
                         totalCas={totalCas}
                         handleChangeOrder={handlerChangeOrder}
                         handlerChangePage={handlerChangePage}
                         handlerChangeRowsPerPage={handlerChangeRowsPerPage} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <h2>Librairies pour des graphes data viz react</h2>
                https://vx-demo.now.sh/gallery<br />
                https://formidable.com/open-source/<br />
                https://uber.github.io/react-vis/<br />
                https://nivo.rocks/<br />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <h2>To do</h2>
                - Tab 1: Modal pop up pour afficher les données plus détaillés lors d'un clique sur le tableau,<br />
                avec tous les témoignages pour ce cas etc <br />
                - Tab 1: Ajouter des filtres (certaines classifications, certaines zones ...) <br />
                <br />
                - Tab 2: Quelques graphes statistiques ... par exemple un graphe avec le nombre de cas par an,<br />
                un graphe qui montre les cas les plus mystérieux (beaucoup de témoignages, beaucoup de cas <br />
                similaires en peu de temps...)
            </TabPanel>
        </div>
    );
};

export default NavigationTabs;