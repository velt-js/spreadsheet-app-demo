import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ROW_DATA } from '../../services/db.service';

@Component({
	selector: 'app-document',
	standalone: true,
	imports: [AgGridAngular],
	templateUrl: './document.component.html',
	styleUrl: './document.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DocumentComponent {

	async ngOnInit(): Promise<void> {
		if (window.innerWidth < 1200 && this.gridApi) {
			this.updateGridForScreenSize();
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		if (this.gridApi)
			this.updateGridForScreenSize();
	}


	private gridApi!: GridApi;

	rowData = ROW_DATA

	colDefs: ColDef[] = [
		{
			headerName: ' ',
			field: "columnId",
			maxWidth: 60,
			resizable: false,
			cellClass: 'disable-cell',
			autoHeight: true,
		},
		{
			headerName: 'A',
			field: "mission",
			flex: 2,
			resizable: false,

			autoHeight: true,

		},
		{
			headerName: 'B',
			field: "destination",
			flex: 2,
			resizable: false,

			autoHeight: true,

		}
		,
		{
			headerName: 'C',
			field: "missionType",
			flex: 2,
			resizable: false,

			autoHeight: true,

		}
		,
		{
			headerName: 'D',
			field: "empty1",
			flex: 2,
			resizable: false,

			autoHeight: true,

		}
		,
		{
			headerName: 'E',
			field: "empty2",
			flex: 2,
			resizable: false,

			autoHeight: true,

		}
		,
		{
			headerName: 'F',
			field: "empty3",
			flex: 1.5,
			resizable: false,

			autoHeight: true,

		}
	].map(col => ({
		...col,
		cellRenderer: this.cellRenderer
	}));

	gridOptions: {
		columnDefs: ColDef[];
		rowData: Array<{ mission: string; destination: string; missionType: string }>;
		rowStyle: { [key: string]: string };
		defaultColDef: { sortable: boolean; filter: boolean };
		rowSelection: 'single' | 'multiple';
	} = {
			columnDefs: this.colDefs,
			rowData: this.rowData,
			rowStyle: { 'font-size': '12px' },
			defaultColDef: {
				sortable: true,
				filter: false,
			},
			rowSelection: 'single',

		};

	cellRenderer(params: any) {

		const cellId = `cell-${params.data.columnId}-${params.colDef.field}`;
		const commentTool = isNaN(params.value) ?
			`<velt-comment-tool shadow-dom="false" id="${cellId}" target-comment-element-id="${cellId}"></velt-comment-tool>` :
			'';

		return `
    <div>
    ${params.value}
    ${commentTool}
    </div>
  `;
	}

	onGridReady(params: GridReadyEvent) {
		console.log(params);
		this.gridApi = params.api;
	}

	updateGridForScreenSize() {
		console.log(this.gridApi);

		if (window.innerWidth < 1200) {
			let updatedGrid = this.gridOptions;
			updatedGrid.columnDefs[4].hide = true;
			updatedGrid.columnDefs[5].hide = true;
			updatedGrid.columnDefs[6].hide = true;
			this.gridApi.setGridOption('columnDefs', updatedGrid.columnDefs);
		} else {
			let updatedGrid = this.gridOptions;
			updatedGrid.columnDefs[4].hide = false;
			updatedGrid.columnDefs[5].hide = false;
			updatedGrid.columnDefs[6].hide = false;
			this.gridApi.setGridOption('columnDefs', updatedGrid.columnDefs);
		}
	}
}
