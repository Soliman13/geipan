import React, {useEffect} from 'react';
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

function TableauHead(props) {
    const { classes, order, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const headCells = [
        { id: 'name', toBeOrdered: false, label: 'Nom' },
        { id: 'resume', toBeOrdered: false, label: 'Résumé' },
        { id: 'date', toBeOrdered: false, label: 'Date d\'observation' },
        { id: 'lieu', toBeOrdered: false, label: 'Lieu' },
        { id: 'classification', toBeOrdered: true, label: 'Classification' },
    ];

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        className={classes.head}
                        align="center">
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
    const classes = useStyles();
    const [order, setOrder] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = () => {
        order === 1 ? setOrder(-1) : setOrder(1);
    };

    useEffect(() => {
        props.handleChangeOrder(order);
    }, [order]);

    const handleClick = (event, name) => {
        // TODO open modal
        // const selectedIndex = selected.indexOf(name);
        // let newSelected = [];
        //
        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name);
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1),
        //     );
        // }
        //
        // setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        props.handlerChangePage(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        let rowsPerPage = parseInt(event.target.value, 10);
        props.handlerChangeRowsPerPage(rowsPerPage);
        setRowsPerPage(rowsPerPage);
        setPage(0);
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
                            order={order}
                            onRequestSort={handleRequestSort} />
                        <TableBody>
                            {props.data.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.name)}
                                            tabIndex={-1}
                                            key={row._id}>
                                            <TableCell component="th" scope="row" padding="default">
                                                {row.cas_nom_dossier}
                                            </TableCell>
                                            <TableCell align="center">{row.cas_resume_web}</TableCell>
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
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage} />
            </Paper>
        </div>
    );
};

export default Tableau;
