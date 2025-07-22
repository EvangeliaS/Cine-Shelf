import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesCollectionsComponent } from './movies-collections.component';

describe('MoviesCollectionsComponent', () => {
  let component: MoviesCollectionsComponent;
  let fixture: ComponentFixture<MoviesCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
