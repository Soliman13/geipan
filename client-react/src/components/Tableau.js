import React from 'react';
import './Tableau.css';

import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Modal from 'react-bootstrap/Modal'

function TableauHead(props) {
    const { classes, order, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const headCells = [
        { id: 'name', toBeOrdered: false, label: 'Nom', minWidth: 150 },
        { id: 'resume', toBeOrdered: false, label: 'Résumé', minWidth: 250, maxWidth: 250 },
        { id: 'date', toBeOrdered: false, label: 'Date d\'observation', minWidth: 130 },
        { id: 'zone', toBeOrdered: false, label: 'Zone', minWidth: 130 },
        { id: 'classification', toBeOrdered: true, label: 'Classification', minWidth: 220 },
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        className={classes.head}
                        align="center"
                        style={headCell}>
                        {headCell.toBeOrdered ? (
                            <TableSortLabel
                                direction={order === 1 ? 'asc' : 'desc'}
                                onClick={createSortHandler()}>
                                {headCell.label}
                            </TableSortLabel>
                        ) : headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    head: {
        backgroundColor: '#555BFF',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
}));

const Tableau = (props) => {

    const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const [show, setShow] = React.useState(false);
    const classes = useStyles();

    const classifications = ['A', 'B', 'C', 'D', 'D1', 'Autres'];

    const handleFilter = async (id, value) => {
        props.asyncHandleChangeNameFilter(id, value);
    };
    const [cas_id, setID] = React.useState('');

    const [cas, setCas] = React.useState([]);

    const getDataFromServer = () => {
        //let url = 'http://localhost:8080/api/v1/cas/'+ cas_id;
        let url = 'http://localhost:8080/api/v1/cas/5e309148d05f7366cbb69628';
        fetch(url)

            .then(response => {
                console.log("reponse json= ", response);
                return response.json(); // transforme le json texte en objet js
            })
            .then(res => { // res c'est le texte json de response ci-dessus
                setCas(function (oldCas) {
                    const newCas = res;
                    return newCas;
                });

            })
            .catch(err => {
                console.log("erreur dans le get : " + err)
            });

    };
    const handleClickRow = (event, name) => {
        setShow(true);
        getDataFromServer();
        console.log('cas :' + cas);
        return (
            alert("coucou"),
            <Modal size="sm" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton="true">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Details cas
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>
                        {cas.cas_nom_dossier}
                    </h1>
                    <p>ID Cas : {cas.id_cas}</p>
                    <p>Nom de la zone : {cas.cas_zone_nom}</p>
                    <p>Code Postal : {cas.cas_zone_code}</p>
                    <p>Type de la zone : {cas.cas_zone_type}</p>
                    <p>Date d'observation : {cas.cas_JJ}/{cas.cas_MM}/{cas.cas_AAAA}</p>
                    <p>Description : {cas.cas_resume}{cas.cas_public}{cas.cas_temoignages_nb}{cas.cas_temoins_nb}</p>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        );
    };

    const handleRequestSort = () => {
        props.handlerChangeOrder();
    };

    const handleChangePage = (event, newPage) => { props.handlerChangePage(newPage) };

    const handleChangeRowsPerPage = event => {
        let rowsPerPage = parseInt(event.target.value, 10);
        props.handlerChangeRowsPerPage(rowsPerPage);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="Observations GEIPAN"
                        size="medium"
                        aria-label="enhanced table">
                        <TableauHead
                            classes={classes}
                            order={props.order}
                            onRequestSort={handleRequestSort} />
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">
                                    <TextField
                                        label="Nom dossier"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={e => handleFilter('name', e.target.value)} />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        label="Résumé"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={e => handleFilter('resume', e.target.value)} />
                                </TableCell>
                                <TableCell align="center">Filtre date</TableCell>
                                <TableCell align="center">
                                    <TextField
                                        label="Zone"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        onChange={e => handleFilter('zone', e.target.value)} />
                                </TableCell>
                                <TableCell align="center">
                                    <Autocomplete
                                        multiple
                                        options={classifications}
                                        style={{width: '100%'}}
                                        disableCloseOnSelect
                                        onChange={(e, value) => handleFilter('classification', value)}
                                        getOptionLabel={classification => classification}
                                        renderOption={(classification, { selected }) => (
                                            <React.Fragment>
                                                <Checkbox
                                                    icon={uncheckedIcon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected} />
                                                {classification}
                                            </React.Fragment>
                                        )}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Classifications"
                                                placeholder="Classifications"
                                                fullWidth />
                                        )} />
                                </TableCell>
                            </TableRow>
                            {props.data.map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        onClick={event => handleClickRow(event, row.name)}
                                        tabIndex={-1}
                                        key={row._id}
                                        className="Row">
                                        <TableCell component="th" scope="row" padding="default">
                                            {row.cas_nom_dossier}
                                        </TableCell>
                                        <TableCell align="justify">
                                            <p className="Resume">
                                                {row.cas_resume}
                                            </p>
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.cas_JJ === '--' ? '' : `${row.cas_JJ}/`}
                                            {row.cas_MM === '--' ? '' : `${row.cas_MM}/`}
                                            {row.cas_AAAA}
                                        </TableCell>
                                        <TableCell align="center">{row.cas_zone_nom}</TableCell>
                                        <TableCell align="center">{row.cas_classification}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={props.totalCas}
                    rowsPerPage={props.rowsPerPage}
                    page={props.page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage} />
            </Paper>
        </div>
    );
};

export default Tableau;
