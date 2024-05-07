import React from 'react';
import { EditorState } from 'draft-js';
import TestRenderer from 'react-test-renderer';
import EditorComponent from './EditorComponent';

describe('EditorComponent', () => {
    it('renders with correct props', () => {
        // Create a mock editorState object
        const editorState = EditorState.createEmpty();

        const handleEditorStateChange = jest.fn();
        
        const testRenderer = TestRenderer.create(
        <EditorComponent
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
        />
        );
        const instance = testRenderer.root;

        // Find the Editor component by type
        const editorComponent = instance.findByType(EditorComponent);

        // Check if the editorState and onEditorStateChange are correctly passed
        expect(editorComponent.props.editorState).toEqual(editorState);
        expect(editorComponent.props.onEditorStateChange).toEqual(handleEditorStateChange);
    });
  
    it('calls onEditorStateChange when editor state changes', () => {
        const handleEditorStateChange = jest.fn();
        const testRenderer = TestRenderer.create(
        <EditorComponent onEditorStateChange={handleEditorStateChange} />
        );
        const instance = testRenderer.root;

        // Find the Editor component by type
        const editorComponents = instance.findAllByType(EditorComponent);

        // Pick the first instance
        const editorComponent = editorComponents[0];

        // Simulate editor state change
        const newEditorState = EditorState.createEmpty();
        editorComponent.props.onEditorStateChange(newEditorState);

        // Check if onEditorStateChange has been called with the correct editor state
        expect(handleEditorStateChange).toHaveBeenCalledWith(newEditorState);
    });
});
