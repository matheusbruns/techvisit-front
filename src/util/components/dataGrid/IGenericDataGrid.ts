import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

export interface GenericDataGridProps {
    rows: any[];
    columns: GridColDef[];
    selectedRows: GridRowSelectionModel;
    onRowSelectionChange: (newSelection: GridRowSelectionModel) => void;
    pageSizeOptions: number[];
    rowsPerPage: number;
}