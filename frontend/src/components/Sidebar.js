import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ 
  data, 
  onEdit, 
  onDelete, 
  onAddNew,
  selectedData,
  onDataSelect 
}) => {
  const [activeTab, setActiveTab] = useState('data');

  return (
    <div className="sidebar fixed-sidebar">
      <div className="sidebar-header">
        <h2>GIS Manager</h2>
      </div>

      <div className="sidebar-tabs">
        <button 
          className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <i className="fas fa-database"></i>
          Data Spasial
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <i className="fas fa-tools"></i>
          Tools
        </button>
        <button 
          className={`tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          <i className="fas fa-layer-group"></i>
          Layers
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'data' && (
          <DataPanel 
            data={data}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddNew={onAddNew}
            selectedData={selectedData}
            onDataSelect={onDataSelect}
          />
        )}
        
        {activeTab === 'tools' && (
          <ToolsPanel />
        )}
        
        {activeTab === 'layers' && (
          <LayersPanel />
        )}
      </div>
    </div>
  );
};

const DataPanel = ({ data, onEdit, onDelete, onAddNew, selectedData, onDataSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="data-panel">
      <div className="panel-header">
        <h3>Data Spasial</h3>
        <button className="btn-add-sidebar" onClick={onAddNew}>
          <i className="fas fa-plus"></i>
          Tambah Data
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Cari data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search"></i>
      </div>

      <div className="data-list-sidebar">
        {filteredData.length === 0 ? (
          <div className="no-data">
            {searchTerm ? 'Tidak ada data yang cocok' : 'Belum ada data'}
          </div>
        ) : (
          filteredData.map(item => (
            <div 
              key={item.id} 
              className={`data-item ${selectedData?.id === item.id ? 'selected' : ''}`}
              onClick={() => onDataSelect(item)}
            >
              <div className="data-item-header">
                <h4>{item.name}</h4>
                <div className="data-item-actions">
                  <button 
                    className="btn-edit-sidebar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn-delete-sidebar"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    title="Hapus"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="data-item-info">
                <p className="description">{item.description}</p>
                <div className="coordinates">
                  <small>
                    <i className="fas fa-map-marker-alt"></i>
                    {item.location?.lat?.toFixed(6) || 'N/A'}, {item.location?.lng?.toFixed(6) || 'N/A'}
                  </small>
                </div>
              </div>
              
              <div className="data-item-meta">
                <span className="data-type">
                  <i className="fas fa-dot-circle"></i>
                  Point
                </span>
                <span className="data-date">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ToolsPanel = () => {
  const tools = [
    { id: 'measure', name: 'Ukur Jarak', icon: 'fa-ruler', description: 'Ukur jarak antar titik' },
    { id: 'area', name: 'Ukur Area', icon: 'fa-draw-polygon', description: 'Hitung luas area' },
    { id: 'buffer', name: 'Buffer Analysis', icon: 'fa-circle', description: 'Analisis buffer zona' },
    { id: 'nearest', name: 'Nearest Neighbor', icon: 'fa-crosshairs', description: 'Cari titik terdekat' },
    { id: 'export', name: 'Export Data', icon: 'fa-download', description: 'Export ke berbagai format' },
    { id: 'import', name: 'Import Data', icon: 'fa-upload', description: 'Import dari file' }
  ];

  return (
    <div className="tools-panel">
      <div className="panel-header">
        <h3>Tools GIS</h3>
      </div>
      
      <div className="tools-grid">
        {tools.map(tool => (
          <div key={tool.id} className="tool-item">
            <div className="tool-icon">
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <div className="tool-info">
              <h4>{tool.name}</h4>
              <p>{tool.description}</p>
            </div>
            <button className="tool-action">
              <i className="fas fa-play"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LayersPanel = () => {
  const [layers, setLayers] = useState([
    { id: 'osm', name: 'OpenStreetMap', visible: true, type: 'base' },
    { id: 'satellite', name: 'Satellite', visible: false, type: 'base' },
    { id: 'spatial_data', name: 'Data Spasial', visible: true, type: 'overlay' },
    { id: 'boundaries', name: 'Batas Wilayah', visible: false, type: 'overlay' }
  ]);

  const toggleLayer = (id) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  return (
    <div className="layers-panel">
      <div className="panel-header">
        <h3>Layer Control</h3>
      </div>
      
      <div className="layers-section">
        <h4>Base Maps</h4>
        {layers.filter(layer => layer.type === 'base').map(layer => (
          <div key={layer.id} className="layer-item">
            <label className="layer-label">
              <input
                type="radio"
                name="basemap"
                checked={layer.visible}
                onChange={() => toggleLayer(layer.id)}
              />
              <span className="layer-name">{layer.name}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="layers-section">
        <h4>Overlay Layers</h4>
        {layers.filter(layer => layer.type === 'overlay').map(layer => (
          <div key={layer.id} className="layer-item">
            <label className="layer-label">
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => toggleLayer(layer.id)}
              />
              <span className="layer-name">{layer.name}</span>
            </label>
            <div className="layer-actions">
              <button className="layer-settings" title="Settings">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
