import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
declare var $: any;

@Component({
 selector: 'app-book',
 templateUrl: './book.component.html',
 styleUrls: ['./book.component.scss']
})
export class BookComponent implements AfterViewInit {
 @ViewChild('book') bookElement!: ElementRef;
 numberOfPages = 1000; // Total number of pages in the book

 ngAfterViewInit() {
    const book = $(this.bookElement.nativeElement);
    book.turn({
      acceleration: true,
      pages: this.numberOfPages,
      elevation: 50,
      gradients: $.isTouch,
      when: {
        turning: (e: any, page: number, view: any) => {
          this.addPage(page, book);
        },
        turned: (e: any, page: number) => {
          this.updatePageNumber(page);
        }
      }
    });

    // Initialize the page number display
    $('#number-pages').html(this.numberOfPages);

    // Handle page number input
    $('#page-number').keydown((e: { keyCode: number; }) => {
      if (e.keyCode === 13) {
        book.turn('page', $('#page-number').val());
      }
    });

    // Handle keyboard navigation
    $(window).bind('keydown', (e: { target: { tagName: string; }; keyCode: number; }) => {
      if (e.target && e.target.tagName.toLowerCase() !== 'input') {
        if (e.keyCode === 37) {
          book.turn('previous');
        } else if (e.keyCode === 39) {
          book.turn('next');
        }
      }
    });
 }

 addPage(page: number, book: any) {
    if (!book.turn('hasPage', page)) {
      const element = $('<div />', { 'class': 'page ' + ((page % 2 === 0) ? 'odd' : 'even'), 'id': 'page-' + page }).html('<i class="loader"></i>');
      book.turn('addPage', element, page);
      setTimeout(() => {
        element.html('<div class="data">Data for page ' + page + '</div>');
      }, 1000);
    }
 }

 updatePageNumber(page: number) {
    $('#page-number').val(page);
 }
}
