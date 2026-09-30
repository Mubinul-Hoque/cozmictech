// ---------------------------------------------------------------------------
// Sector-Specific Specification Field Definitions
// ---------------------------------------------------------------------------
// Keyed by the exact `sectors.name` string from the database.
// This file is placed in shared/utils/ so Nuxt auto-imports it on the client
// side; server routes import it explicitly.
// ---------------------------------------------------------------------------

export type SpecFieldType = 'text' | 'textarea' | 'number'

export interface SectorSpecField {
  key: string
  label: string
  unit?: string
  type?: SpecFieldType
}

export const SECTOR_SPEC_FIELDS: Record<string, SectorSpecField[]> = {

  // ─── Oil & Gas ────────────────────────────────────────────────────────────
  'Oil & Gas': [
    { key: 'facility_type',      label: 'Facility / Asset Type',            type: 'text' },
    { key: 'capacity',           label: 'Production / Processing Capacity', type: 'text' },
    { key: 'well_field_info',    label: 'Well / Field Information',         type: 'textarea' },
    { key: 'pipeline_info',      label: 'Pipeline Information',             type: 'text' },
    { key: 'process_facilities', label: 'Process Facilities',               type: 'textarea' },
    { key: 'storage_facilities', label: 'Storage Facilities',               type: 'text' },
    { key: 'engineering_scope',  label: 'Engineering Scope',                type: 'textarea' },
    { key: 'major_equipment',    label: 'Major Equipment / Systems',        type: 'textarea' },
    { key: 'hse_requirements',   label: 'HSE / Safety Requirements',        type: 'textarea' },
    { key: 'other_details',      label: 'Other Relevant Details',           type: 'textarea' },
  ],

  // ─── Power & Energy (Power Plant) ─────────────────────────────────────────
  'Power & Energy': [
    { key: 'plant_type',            label: 'Plant Type',                    type: 'text' },
    { key: 'generation_capacity',   label: 'Generation Capacity',  unit: 'MW', type: 'text' },
    { key: 'fuel_type',             label: 'Fuel Type',                     type: 'text' },
    { key: 'number_of_units',       label: 'Number of Units',               type: 'number' },
    { key: 'generation_technology', label: 'Generation Technology',         type: 'text' },
    { key: 'substation_switchyard', label: 'Substation / Switchyard',       type: 'text' },
    { key: 'major_equipment',       label: 'Major Equipment',               type: 'textarea' },
    { key: 'epc_scope',             label: 'EPC / Consultancy Scope',       type: 'textarea' },
    { key: 'grid_connection',       label: 'Grid Connection',               type: 'text' },
    { key: 'other_details',         label: 'Other Relevant Details',        type: 'textarea' },
  ],

  // ─── Environment ──────────────────────────────────────────────────────────
  'Environment': [
    { key: 'assessment_type',       label: 'Environmental Assessment Type', type: 'text' },
    { key: 'study_area',            label: 'Study Area',                    type: 'text' },
    { key: 'components_studied',    label: 'Environmental Components Studied', type: 'textarea' },
    { key: 'baseline_survey',       label: 'Baseline Survey',               type: 'text' },
    { key: 'eia_scope',             label: 'EIA / IEE / EMP Scope',         type: 'textarea' },
    { key: 'monitoring',            label: 'Environmental Monitoring',      type: 'textarea' },
    { key: 'social_assessment',     label: 'Social / Environmental Assessment', type: 'textarea' },
    { key: 'regulatory_compliance', label: 'Regulatory / Compliance Requirements', type: 'textarea' },
    { key: 'other_details',         label: 'Other Relevant Details',        type: 'textarea' },
  ],

  // ─── Jetties & Marine Infrastructure ──────────────────────────────────────
  'Jetties & Marine Infrastructure': [
    { key: 'jetty_type',              label: 'Jetty Type',              type: 'text' },
    { key: 'jetty_length',            label: 'Jetty Length',   unit: 'm',   type: 'text' },
    { key: 'berthing_capacity',       label: 'Berthing Capacity', unit: 'DWT', type: 'text' },
    { key: 'design_vessel',           label: 'Design Vessel',          type: 'text' },
    { key: 'water_depth',             label: 'Water Depth',    unit: 'm',   type: 'text' },
    { key: 'navigational_facilities', label: 'Navigational Facilities', type: 'textarea' },
    { key: 'dredging_scope',          label: 'Dredging Scope',  unit: 'm³', type: 'text' },
    { key: 'hydrographic_survey',     label: 'Hydrographic Survey',    type: 'text' },
    { key: 'geotechnical_investigation', label: 'Geotechnical Investigation', type: 'text' },
    { key: 'marine_structures',       label: 'Marine Structures',      type: 'textarea' },
    { key: 'shore_protection',        label: 'Shore Protection',       type: 'text' },
    { key: 'other_details',           label: 'Other Relevant Details', type: 'textarea' },
  ],

  // ─── Roads & Highway ──────────────────────────────────────────────────────
  'Roads & Highway': [
    { key: 'road_type',       label: 'Road Type / Classification', type: 'text' },
    { key: 'road_length',     label: 'Road Length',      unit: 'km',  type: 'text' },
    { key: 'number_of_lanes', label: 'Number of Lanes',             type: 'number' },
    { key: 'pavement_type',   label: 'Pavement Type',              type: 'text' },
    { key: 'right_of_way',    label: 'Right of Way',     unit: 'm',   type: 'text' },
    { key: 'bridges_culverts',label: 'Bridges / Culverts',         type: 'textarea' },
    { key: 'intersections',   label: 'Intersections',              type: 'text' },
    { key: 'drainage',        label: 'Drainage',                   type: 'textarea' },
    { key: 'traffic_studies', label: 'Traffic / Transport Studies', type: 'textarea' },
    { key: 'geometric_design',label: 'Geometric Design',           type: 'textarea' },
    { key: 'other_details',   label: 'Other Relevant Details',     type: 'textarea' },
  ],

  // ─── Power Transmission & Distribution ────────────────────────────────────
  'Power Transmission & Distribution': [
    { key: 'voltage',              label: 'Transmission / Distribution Voltage', unit: 'kV',  type: 'text' },
    { key: 'line_length',          label: 'Line Length',         unit: 'km',  type: 'text' },
    { key: 'substation_capacity',  label: 'Substation Capacity', unit: 'MVA', type: 'text' },
    { key: 'number_of_substations',label: 'Number of Substations',             type: 'number' },
    { key: 'tower_pole_type',      label: 'Tower / Pole Type',                 type: 'text' },
    { key: 'circuit_configuration',label: 'Circuit Configuration',             type: 'text' },
    { key: 'transformer_capacity', label: 'Transformer Capacity', unit: 'MVA', type: 'text' },
    { key: 'distribution_network', label: 'Distribution Network',              type: 'textarea' },
    { key: 'grid_connection',      label: 'Grid Connection',                   type: 'text' },
    { key: 'protection_control',   label: 'Protection & Control Systems',      type: 'textarea' },
    { key: 'other_details',        label: 'Other Relevant Details',            type: 'textarea' },
  ],

  // ─── Building / Infrastructure ────────────────────────────────────────────
  'Building': [
    { key: 'building_type',          label: 'Building Type',                type: 'text' },
    { key: 'gross_floor_area',       label: 'Gross Floor Area', unit: 'm²',  type: 'text' },
    { key: 'floors_basement',        label: 'Floors / Basement Configuration', type: 'text' },
    { key: 'building_height',        label: 'Building Height',  unit: 'm',   type: 'text' },
    { key: 'structural_system',      label: 'Structural System',            type: 'text' },
    { key: 'architectural_scope',    label: 'Architectural Scope',          type: 'textarea' },
    { key: 'structural_scope',       label: 'Structural Scope',             type: 'textarea' },
    { key: 'mep_systems',            label: 'MEP Systems',                  type: 'textarea' },
    { key: 'green_building',         label: 'Green Building / Sustainability Features', type: 'textarea' },
    { key: 'site_development',       label: 'Site Development',             type: 'textarea' },
    { key: 'infrastructure_components', label: 'Infrastructure Components', type: 'textarea' },
    { key: 'other_details',          label: 'Other Relevant Details',       type: 'textarea' },
  ],
}

/**
 * Returns the ordered array of spec fields for a given sector name.
 * Returns an empty array for sectors with no defined spec (e.g. Transportation, Bridge).
 */
export function getSectorSpecFields(sectorName?: string | null): SectorSpecField[] {
  if (!sectorName) return []
  return SECTOR_SPEC_FIELDS[sectorName] ?? []
}
