export interface Main {
  message: string;
  response: Response;
}

export interface Response {
  modelVersion: string;
  captionResult: CaptionResult;
  denseCaptionsResult: DenseCaptionsResult;
  metadata: Metadata;
  tagsResult: TagsResult;
  objectsResult: ObjectsResult;
  readResult: ReadResult;
  smartCropsResult: SmartCropsResult;
  peopleResult: PeopleResult;
}

export interface CaptionResult {
  text: string;
  confidence: number;
}

export interface DenseCaptionsResult {
  values: DenseCaptionsResultValue[];
}

export interface DenseCaptionsResultValue {
  text: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Metadata {
  width: number;
  height: number;
}

export interface ObjectsResult {
  values: ObjectsResultValue[];
}

export interface ObjectsResultValue {
  boundingBox: BoundingBox;
  tags: TagElement[];
}

export interface TagElement {
  name: string;
  confidence: number;
}

export interface PeopleResult {
  values: PeopleResultValue[];
}

export interface PeopleResultValue {
  boundingBox: BoundingBox;
  confidence: number;
}

export interface ReadResult {
  blocks: any[];
}

export interface SmartCropsResult {
  values: SmartCropsResultValue[];
}

export interface SmartCropsResultValue {
  aspectRatio: number;
  boundingBox: BoundingBox;
}

export interface TagsResult {
  values: TagElement[];
}
