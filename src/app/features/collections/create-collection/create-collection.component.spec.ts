import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionComponent } from './create-collection.component';

describe('CreateCollectionComponent', () => {
  let component: CreateCollectionComponent;
  let fixture: ComponentFixture<CreateCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
