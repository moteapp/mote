import { EditorInputCapabilities, IUntypedEditorInput } from 'mote/workbench/common/editor';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';
import { AbstractResourceEditorInput } from 'mote/workbench/common/editor/resourceEditorInput';
import { ICustomEditorLabelService } from 'mote/workbench/services/editor/common/customEditorLabelService';
import { IFilesConfigurationService } from 'mote/workbench/services/filesConfiguration/common/filesConfigurationService';
import { Schemas } from 'vs/base/common/network';
import { isEqual } from 'vs/base/common/resources';
import { URI } from 'vs/base/common/uri';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/textResourceConfiguration';
import { IFileService } from 'vs/platform/files/common/files';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ILabelService } from 'vs/platform/label/common/label';

export interface NotebookEditorInputOptions {
  
}

export class NotebookEditorInput extends AbstractResourceEditorInput {

    static readonly ID: string = 'workbench.input.notebook';

    static getOrCreate(instantiationService: IInstantiationService, resource: URI, preferredResource: URI | undefined, viewType: string, options: NotebookEditorInputOptions = {}) {
		const editor = instantiationService.createInstance(NotebookEditorInput, resource, preferredResource, viewType, options);
		if (preferredResource) {
			editor.setPreferredResource(preferredResource);
		}
		return editor;
	}

    constructor(
        resource: URI,
        preferredResource: URI | undefined,
        public readonly viewType: string,
        public readonly options: NotebookEditorInputOptions,
        @ILabelService labelService: ILabelService,
        @IFileService fileService: IFileService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
        @ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
    ) {
        super(resource, preferredResource, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
    }

    override get typeId(): string {
		return NotebookEditorInput.ID;
	}

    override get editorId(): string | undefined {
		return this.viewType;
	}

    override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.None;
        if (this.resource.scheme === Schemas.untitled) {
			capabilities |= EditorInputCapabilities.Untitled;
		}
        return capabilities;
    }

    override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(otherInput)) {
			return true;
		}

		if (otherInput instanceof NotebookEditorInput) {
			return isEqual(otherInput.resource, this.resource);
		}

		return false;
	}
}