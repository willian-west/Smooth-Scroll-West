# Smooth Scroll - West

The **Smooth Scroll** allows you to create a smooth scrolling for your web page.

<br>

## Quick start

### Install

Download the [latest release](https://github.com/willian-west/Smooth-Scroll-West/releases).

<br>

### Load

#### Static HTML

Put the required stylesheet at the **top** of your markup:

```html
<link rel="stylesheet" href="/your-assets/css/smooth-scroll-west.min.css" />
```



Put the script at the **bottom** of your markup:

```html
<script src="/your-assets/js/smooth-scroll-west.min.js"></script>
```

<br>


### Usage

Wrap your content with the **`smooth-scroll-container`** and **`smooth-scroll-content`** classes as below. The existence of the classes is enough to initialize the script automatically.

```html
<main class="smooth-scroll-container">
  <div class="smooth-scroll-content">
    
    <div> Your Content </div>
  
  </div>
</main>
```
**IMPORTANT NOTE:** Elements that have a fixed position, such as **'header', 'menu', 'fixed buttons', 'sidebar'**, among others, must be outside the 
`"smooth-scroll-container"` class.


<br>

```

## License

The code and the documentation are released under the [MIT License](LICENSE).