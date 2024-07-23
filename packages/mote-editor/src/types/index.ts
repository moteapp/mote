import { Node as ProsemirrorNode } from 'prosemirror-model';

export type PlainTextSerializer = (node: ProsemirrorNode) => string;

export enum EventType {
  SuggestionsMenuOpen = "suggestionMenuOpen",
  SuggestionsMenuClose = "suggestionMenuClose",
  LinkToolbarOpen = "linkMenuOpen",
}
