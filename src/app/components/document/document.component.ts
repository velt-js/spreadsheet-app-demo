import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, effect } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ROW_DATA } from '../../services/db.service';
import { VeltService } from '../../services/velt.service';

@Component({
	selector: 'app-document',
	standalone: true,
	imports: [AgGridAngular],
	templateUrl: './document.component.html',
	styleUrl: './document.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DocumentComponent {
	// Getting the Velt Client
	client = this.veltService.clientSignal();

	constructor(
		private veltService: VeltService
	) {
		// Set Document when the velt client is initialized
		effect(() => {

			this.client = this.veltService.clientSignal();
			if (this.client) {

				// Contain your comments in a document by setting a Document ID & Name
				this.client.setDocument('sheets', { documentName: 'sheets' });

				this.client.getCommentElement().disableCommentPinHighlighter()
			}
		});
	}

	async ngOnInit(): Promise<void> {
		// Hide empty cells when screen size is small
		if (window.innerWidth < 1200 && this.gridApi) {
			this.updateGridForScreenSize();
		}
	}

	// Hide empty cells when screen size is small
	@HostListener('window:resize', ['$event'])
	onResize(event: Event) {
		if (this.gridApi)
			this.updateGridForScreenSize();
	}


	private gridApi!: GridApi;

	// Set you Row Data
	rowData = ROW_DATA
	
	// Define your Columns and Add cell renderer function
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

	// Define Grid Settings
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

	/**
	 * Adding our comment tool in each cell using cellRenderer
	 */
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
		this.gridApi = params.api;
	}

	// Hide empty rows in smaller screen sizes
	updateGridForScreenSize() {
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
