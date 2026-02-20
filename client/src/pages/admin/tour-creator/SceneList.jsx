import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Image,
  Upload,
  Edit2,
  Check,
  X
} from 'lucide-react';

const SceneList = ({
  scenes,
  activeIndex,
  onSelect,
  onAdd,
  onRemove,
  onUpdate,
  onUpload,
  onReorder
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (index, title) => {
    setEditingIndex(index);
    setEditTitle(title);
  };

  const handleSaveEdit = (index) => {
    onUpdate(index, { title: editTitle });
    setEditingIndex(null);
  };

  const handleFileSelect = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(index, file);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Scenes ({scenes.length})</h3>
          <button
            onClick={onAdd}
            className="p-2 text-primary-400 hover:bg-primary-500/20 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scene List */}
      <div className="flex-1 overflow-y-auto p-4">
        {scenes.length === 0 ? (
          <div className="text-center py-8">
            <Image className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 mb-4">No scenes yet</p>
            <button
              onClick={onAdd}
              className="btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Scene
            </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={scenes}
            onReorder={onReorder}
            className="space-y-2"
          >
            {scenes.map((scene, index) => (
              <SceneItem
                key={scene.id}
                scene={scene}
                index={index}
                isActive={activeIndex === index}
                isEditing={editingIndex === index}
                editTitle={editTitle}
                onSelect={() => onSelect(index)}
                onStartEdit={() => handleStartEdit(index, scene.title)}
                onSaveEdit={() => handleSaveEdit(index)}
                onCancelEdit={() => setEditingIndex(null)}
                onEditTitleChange={setEditTitle}
                onRemove={() => onRemove(index)}
                onFileSelect={(e) => handleFileSelect(index, e)}
                onUpdateDescription={(desc) => onUpdate(index, { description: desc })}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};

const SceneItem = ({
  scene,
  index,
  isActive,
  isEditing,
  editTitle,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTitleChange,
  onRemove,
  onFileSelect,
  onUpdateDescription
}) => {
  const dragControls = useDragControls();
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Reorder.Item
      value={scene}
      dragListener={false}
      dragControls={dragControls}
      className={`bg-dark-800 rounded-xl overflow-hidden ${
        isActive ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Drag Handle */}
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="p-1 text-dark-500 hover:text-dark-300 cursor-grab active:cursor-grabbing mt-1"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Thumbnail */}
        <div
          onClick={onSelect}
          className="w-20 h-14 rounded-lg bg-dark-700 overflow-hidden cursor-pointer flex-shrink-0"
        >
          {scene.url ? (
            <img
              src={scene.thumbnail || scene.url}
              alt={scene.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-dark-600">
              <Upload className="w-5 h-5 text-dark-500" />
              <input
                type="file"
                accept="image/*"
                onChange={onFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                className="flex-1 px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit();
                  if (e.key === 'Escape') onCancelEdit();
                }}
              />
              <button
                onClick={onSaveEdit}
                className="p-1 text-secondary-400 hover:text-secondary-300"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-dark-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                onClick={onSelect}
                className="text-white font-medium cursor-pointer hover:text-primary-400"
              >
                {scene.title}
              </span>
              <button
                onClick={onStartEdit}
                className="p-1 text-dark-500 hover:text-white opacity-0 group-hover:opacity-100"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-1 text-xs text-dark-500">
            <span>{scene.hotspots?.length || 0} hotspots</span>
            {!scene.url && (
              <span className="text-yellow-500">• No image</span>
            )}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="p-1 text-dark-500 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description (expandable) */}
      {isActive && (
        <div className="px-3 pb-3">
          <textarea
            value={scene.description || ''}
            onChange={(e) => onUpdateDescription(e.target.value)}
            placeholder="Add scene description..."
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-200 placeholder-dark-500 resize-none"
            rows={2}
          />
        </div>
      )}
    </Reorder.Item>
  );
};

export default SceneList;