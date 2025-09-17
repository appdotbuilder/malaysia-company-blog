<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->integer('rating'); // 1-5 stars
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->json('pros')->nullable();
            $table->json('cons')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['company_id', 'rating']);
            $table->index(['user_id', 'created_at']);
            $table->index('is_verified');
            $table->index('is_featured');
            $table->unique(['company_id', 'user_id']); // One review per user per company
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};